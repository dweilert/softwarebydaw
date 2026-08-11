# Site analytics without a tracking script

The download buttons on this site point at GitHub Releases, and the app this
site sells is built on the promise that nothing phones home. Both facts shape
what belongs here: the numbers come from the web server's own record and from
GitHub's own counters, not from a beacon in the visitor's browser.

Nothing here sets a cookie, loads a script, or gives a visitor anything to
block — so there is no consent banner to add and no claim on the site that
needs qualifying.

## What you get, and what you do not

**You get:** requests, unique-ish visitors by IP, which pages, which files,
referrers, user agents, status codes, bytes, and — the one that matters most
here — how many people clicked through toward the download.

**You do not get:** anything that needs JavaScript. Whether someone actually
*played* the overview video, or how far through they got, is invisible to a
server log. If that turns out to matter, a cookieless tracker like GoatCounter
or Plausible is the honest way to add it; the trade is a script on the page.

## The two halves

### 1. Installer downloads — already free, no setup

Downloads happen on GitHub, not here, so no site analytics can see them.
GitHub counts them for you:

```bash
../../retirementPlannerRewrite/scripts/download-counts.sh
```

Installers by release and by platform, separated from documentation fetches so
an SBOM download does not inflate the headline.

### 2. Access logs — `access-logs.yaml`

Amplify Hosting runs on a CloudFront distribution inside AWS's own account, so
CloudFront standard logging cannot be switched on for it.
`amplify:GenerateAccessLogs` is the supported route: it hands back a presigned
CSV for a time range you ask for. Because it is a *pull*, something has to ask
on a schedule — which is all this stack is.

```
EventBridge Scheduler  →  Lambda  →  S3 (raw/dt=YYYY-MM-DD/)  →  Glue crawler  →  Athena
        daily 07:00 UTC     pulls yesterday
```

Everything runs inside AWS. No access keys, nothing on a laptop, no GitHub
Action to keep green.

## Deploying

Once, from an account with permission to create IAM roles (account
`785502284517`, region `us-east-2` — the same one the GitHub deploy role lives
in):

```bash
aws cloudformation deploy \
  --template-file infra/access-logs.yaml \
  --stack-name softwarebydaw-access-logs \
  --capabilities CAPABILITY_IAM \
  --region us-east-2
```

The bucket name must be globally unique; override it if that one is taken:

```bash
  --parameter-overrides BucketName=softwarebydaw-logs-785502284517
```

### First run

The schedule waits until 07:00 UTC. To get data immediately, pull a day by
hand — this is the same command you would use to backfill:

```bash
aws lambda invoke --function-name softwarebydaw-access-logs-puller \
  --payload '{"date":"2026-08-11"}' --cli-binary-format raw-in-base64-out \
  --region us-east-2 /dev/stdout
```

Or, to look at traffic right now without deploying anything at all:

```bash
./infra/fetch-logs.sh 7
```

Then let the crawler finish (it starts automatically at the end of a
successful pull; a minute or two), and query in Athena using the workgroup the
stack creates.

## Queries worth having

The crawler names the columns from the real CSV header rather than a guessed
schema, so **check the column names once** in the Athena console before
relying on these — Amplify's CSV follows CloudFront's fields, but the exact
header is not published, which is why nothing here hardcodes it.

```sql
-- Busiest pages, last 30 days
SELECT "cs-uri-stem" AS page, COUNT(*) AS hits
FROM softwarebydaw_access_logs_db.raw
WHERE dt >= date_format(current_date - interval '30' day, '%Y-%m-%d')
GROUP BY 1 ORDER BY hits DESC LIMIT 25;

-- Where people came from
SELECT "cs(Referer)" AS referrer, COUNT(*) AS hits
FROM softwarebydaw_access_logs_db.raw
WHERE dt >= date_format(current_date - interval '30' day, '%Y-%m-%d')
  AND "cs(Referer)" NOT LIKE '%softwarebydaw.com%'
GROUP BY 1 ORDER BY hits DESC LIMIT 25;

-- Rough daily visitors (distinct IPs — an approximation, not a person count)
SELECT dt, COUNT(DISTINCT "c-ip") AS visitors, COUNT(*) AS requests
FROM softwarebydaw_access_logs_db.raw
GROUP BY dt ORDER BY dt DESC LIMIT 30;

-- Did anyone reach the video?
SELECT dt, COUNT(*) AS requests
FROM softwarebydaw_access_logs_db.raw
WHERE "cs-uri-stem" LIKE '%retirement-planner-overview.mp4%'
GROUP BY dt ORDER BY dt DESC LIMIT 30;
```

Video requests are a floor, not a play count: browsers range-request video, so
one viewer can produce several rows, and `preload="metadata"` means a request
can happen without anyone pressing play.

## Things worth knowing before trusting the numbers

- **Delivery is best-effort.** AWS says entries can arrive late or, rarely, not
  at all, and that the logs are for understanding the shape of traffic rather
  than as a complete accounting. Yesterday's file may fill in after the fact —
  re-pull a day with the backfill command if it looks thin.
- **Retention is generous.** Amplify keeps access logs until the app is
  deleted, so a missed day is recoverable. The two-week limit is on the size of
  a single *request*, not on how far back the logs go.
- **Bots are in there.** These are raw server logs, so crawlers and scanners
  count. Filter on user agent before quoting a visitor number to anybody.
- **Pre-launch noise.** Amplify pre-creates CloudFront distributions and they
  can receive bot traffic before being assigned to an app; entries older than
  the app itself are that, not real visitors.
- **The bucket survives stack deletion**, on purpose. The pipeline can be
  rebuilt; the collected history cannot, once Amplify's window moves past it.

## Cost

Pennies a month at this site's volume: small CSVs in S3, one short Lambda a
day, and Athena at $5/TB scanned against a dataset measured in megabytes.
Athena query results expire after 14 days by lifecycle rule; the raw logs are
kept.
