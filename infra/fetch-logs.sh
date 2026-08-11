#!/usr/bin/env bash
#
# Look at the site's traffic from a laptop, without deploying anything.
#
#   ./infra/fetch-logs.sh            # last 7 days
#   ./infra/fetch-logs.sh 14         # last 14 days (Amplify's per-request cap)
#
# The scheduled S3/Athena pipeline in access-logs.yaml is for keeping history.
# This is for answering a question right now. Same API, one call.
#
# WHY THE APEX DOMAIN AND NOT www: the Amplify domain association is on
# `softwarebydaw.com`, with `www` as a subdomain of it. Asking for
# www.softwarebydaw.com returns NotFoundException, which reads like the logs
# are missing rather than like the name is wrong. Cost twenty minutes once.
set -euo pipefail

DAYS="${1:-7}"
APP_ID="${APP_ID:-d2s5q12tq2w0ac}"
DOMAIN="${DOMAIN:-softwarebydaw.com}"
REGION="${REGION:-us-east-2}"
PROFILE="${AWS_PROFILE:-softwarebydaw-prod}"
OUT="${OUT:-/tmp/amplify-access.csv}"

# BSD date (macOS) vs GNU date (Linux) take different flags for "N days ago".
if date -u -v-1d >/dev/null 2>&1; then
  START="$(date -u -v-"${DAYS}"d +%Y-%m-%dT00:00:00Z)"
else
  START="$(date -u -d "${DAYS} days ago" +%Y-%m-%dT00:00:00Z)"
fi
END="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "Fetching ${DOMAIN} access logs: ${START} .. ${END}"
URL="$(aws amplify generate-access-logs \
  --app-id "$APP_ID" --domain-name "$DOMAIN" \
  --start-time "$START" --end-time "$END" \
  --region "$REGION" --profile "$PROFILE" \
  --query logUrl --output text)"

if [[ "$URL" != http* ]]; then
  echo "No log URL returned — nothing recorded for that window." >&2
  exit 1
fi

curl -sS "$URL" -o "$OUT"
echo "Wrote $OUT ($(( $(wc -l < "$OUT") - 1 )) rows)"
echo

OUT="$OUT" python3 - <<'PY'
import collections, csv, os, re

rows = list(csv.DictReader(open(os.environ["OUT"])))

def col(r, name):
    """Header escapes parentheses — cs\\(Referer) not cs(Referer)."""
    return r.get(name) or r.get(name.replace("(", "\\(").replace(")", "\\)")) or ""

# JUNK IS IDENTIFIED BY PATH, NOT BY USER AGENT, and that is the whole lesson
# of the first version. Filtering on user-agent found ZERO bots in a week of
# traffic that was almost entirely WordPress exploit probes — because scanners
# lie about who they are. What they cannot hide is what they ask for: this site
# has no WordPress, no PHP and no admin panel, so every such request is hostile
# or automated by definition.
JUNK = re.compile(
    r"wp-admin|wp-content|wp-includes|wp-login|xmlrpc|\.php$|/\.env|/\.git"
    r"|phpmyadmin|/vendor/|/cgi-bin/|autodiscover|/boaform|/actuator"
    r"|^//|/Alvin9999|/daohang",
    re.I,
)
real = [r for r in rows if not JUNK.search(col(r, "cs-uri-stem"))]
junk = len(rows) - len(real)

print(f"{len(rows)} requests total — {junk} look like scanners/probes, {len(real)} left\n")

print("BY DAY")
for d in sorted({r["date"] for r in real}):
    day = [r for r in real if r["date"] == d]
    ok = [r for r in day if r["sc-status"] == "200"]
    print(f"   {d}   {len(day):>5} requests  {len({r['c-ip'] for r in day}):>4} IPs  {len(ok):>4} served")

print("\nTOP PATHS SERVED (status 200)")
served = [r for r in real if r["sc-status"] == "200"]
for p, n in collections.Counter(col(r, "cs-uri-stem") for r in served).most_common(10):
    print(f"   {n:>5}  {p}")

print("\nEXTERNAL REFERRERS")
ref = collections.Counter(
    col(r, "cs(Referer)") for r in real
    if col(r, "cs(Referer)") not in ("", "-") and "softwarebydaw" not in col(r, "cs(Referer)")
)
for p, n in ref.most_common(10):
    print(f"   {n:>5}  {p[:76]}")
if not ref:
    print("   (none — traffic is direct, or referrers were stripped)")

vid = [r for r in real if "overview.mp4" in col(r, "cs-uri-stem")]
print(f"\nOVERVIEW VIDEO: {len(vid)} requests from {len({r['c-ip'] for r in vid})} distinct IPs")
print("   Requests are a FLOOR, not plays: browsers range-request video, so one")
print("   viewer makes several rows, and preload=metadata fetches without a play.")

print("\nSTATUS CODES (everything, including junk)")
for s, n in collections.Counter(r["sc-status"] for r in rows).most_common(8):
    print(f"   {s}  {n}")
PY
