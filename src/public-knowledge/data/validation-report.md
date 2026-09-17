# RP — Calculation Validation Report

**Version:** 1.12.0 | **Generated:** 2026-09-13

## ✅ Every calculation passed independent verification

RP is a planning **model**, not a licensed financial advisor — but we hold its calculations to a high bar for accuracy. This report is regenerated for every release: every calculation below has its expected result checked directly against a primary government source (the U.S. Internal Revenue Service, Centers for Medicare & Medicaid Services, or Social Security Administration) or an independently reimplemented calculation — never a third-party summary treated as if it were the original.

## Confidence levels

- **Authority-validated** — the expected result is taken directly from an IRS, CMS, or SSA publication, worksheet, or published example.
- **Cross-validated** — checked against an independent reimplementation of the same published methodology; used when the specific numbers being tested are our own choice rather than a government-published example, or when a parameter (like a multi-year inflation projection) is this app's own forward-looking assumption rather than an already-published fact.
- **Vetted-secondary** — used only when a primary government source was confirmed unreachable or the figure genuinely isn't published yet; in that case, and only then, we require at least two independent, editorially accountable sources that agree and that themselves cite their own primary source — never an unverified blog or AI-generated summary. Always the last resort, always disclosed, never treated as equivalent to a primary source.

97 authority-validated, 66 cross-validated, 0 vetted-secondary, 0 regression-only.

## Results by area

| Area | Cases | Passed |
|---|---:|---:|
| Federal Income Tax | 27 | 27 (100.0%) |
| income-tax-treatment | 1 | 1 (100.0%) |
| State Tax | 10 | 10 (100.0%) |
| Medicare IRMAA (Income-Related Monthly Adjustment) | 26 | 26 (100.0%) |
| Medicaid Long-Term Care — Spousal Impoverishment Protections | 12 | 12 (100.0%) |
| Social Security — Benefit Formula (PIA) | 5 | 5 (100.0%) |
| Social Security — Benefit Estimate from Earnings History | 6 | 6 (100.0%) |
| Social Security — Claiming-Age Adjustments | 4 | 4 (100.0%) |
| Social Security — Retirement Earnings Test | 2 | 2 (100.0%) |
| Social Security — Spousal Benefits | 2 | 2 (100.0%) |
| Social Security — Survivor Benefits | 4 | 4 (100.0%) |
| family-maximum | 5 | 5 (100.0%) |
| Required Minimum Distributions — Your Own Accounts | 7 | 7 (100.0%) |
| Required Minimum Distributions — QLAC Exclusion | 3 | 3 (100.0%) |
| Required Minimum Distributions — Inherited Accounts | 8 | 8 (100.0%) |
| Multi-Year Plan Simulation (Income → Tax → Medicare, End to End) | 1 | 1 (100.0%) |
| Multi-Year Plan Simulation — Roth Conversion | 7 | 7 (100.0%) |
| Multi-Year Plan Simulation — Survivor Filing-Status Transition | 2 | 2 (100.0%) |
| Multi-Year Plan Simulation — Survivor Social Security Step-Up | 3 | 3 (100.0%) |
| ACA Marketplace Premium Tax Credit | 4 | 4 (100.0%) |
| Equity Compensation — Incentive Stock Options (ISO) | 1 | 1 (100.0%) |
| Equity Compensation — Employee Stock Purchase Plan (ESPP) | 1 | 1 (100.0%) |
| Property Sale — Home Sale (Section 121 Exclusion) | 1 | 1 (100.0%) |
| Property Sale — Rental (Depreciation Recapture) | 1 | 1 (100.0%) |
| Early-Withdrawal Penalty (10%, Pre-59½) | 2 | 2 (100.0%) |
| property-step-up | 8 | 8 (100.0%) |
| self-employment-tax | 5 | 5 (100.0%) |
| step-up-basis | 5 | 5 (100.0%) |

## State income tax — why few cases, and what else holds it

A golden case needs an expected answer that some authority has actually published. The IRS, CMS and the Social Security Administration publish worked examples and tables, so their rules can be checked that way. Most states publish a bracket schedule and nothing else — no worked return, no citable answer to compare against — and for tax year 2026 most have not yet published their inflation-indexed figures at all; those arrive with filing-season instructions. This project's rule is that an unpublished figure is left absent rather than invented, so state golden cases are written only where a state's own schedule is published and unambiguous. The count in the table above is small on purpose, and it is not the only evidence behind state tax.

**Every taxing jurisdiction is gated, whether or not it has a golden case.** The data carries 51 jurisdictions, of which 42 levy an ordinary income tax; the rest (AK, FL, NH, NV, SD, TN, TX, WA, WY) have no state income tax arithmetic to check. For all 42, automated gates compare the shipped top marginal rate and bracket count, and the shipped standard deduction, against an archived rate table on every push. That table is a **tripwire, not an authority**: when it disagrees, the fix is taken from the state's own statute, never from the table. Ohio's correction was made exactly that way — the disagreement surfaced in the gate, and the rate came from ORC 5747.02.

| State-tax evidence | Jurisdictions |
|---|---:|
| Levy an ordinary income tax | 42 |
| Figures cited to the state's own statute or revenue agency | 21 |
| Figures cited to a vetted secondary, pending publication | 21 |
| No structured citation recorded yet | 0 |
| Disagreeing with the tripwire table, awaiting a statute reading | 0 |
| Exempting Social Security from state tax | 38 |
| Modeling a capped or phased retirement-income exclusion | 18 |

**Last primary-source pass.** 2026-08-06 — every state whose rates disagreed with the archived rate table has been corrected against that state's own statute or its revenue agency's published schedule: OH, AR, GA, ID, KY, MD, MT, NE, OK, SC, UT, WV, IN and MO. Each state's notes name the document read. Where a threshold is inflation-indexed by the state and the current year's table is not yet published, the indexed figure comes from the archived rate table and the state's notes say so. Standard deductions were not re-verified in this pass. Standard deductions reviewed 2026-08-06: seven federal-conformity states set to the verified 2026 federal amount, Kansas and Virginia confirmed against their own revenue agencies, and the remainder taken from the archived rate table because no state had published a tax-year-2026 figure yet. Each state's notes say which.

The states whose retirement-income relief this app cannot apply are named in the limitations below, with the direction the error runs. A state with no exclusion recorded is treated as taxing retirement income in full — which overstates that household's tax rather than understating it.

## Where the lines are drawn

Some rules change the answer the moment income crosses a number. A Medicare surcharge tier is the clearest: a dollar either way is worth over a thousand dollars a year. Whether income landing EXACTLY on such a number falls in the band below or the band above is decided by the wording the agency publishes, and it is not always the same wording — Medicare's own table is inclusive at four boundaries and exclusive at the fifth.

**This is where this project shipped a wrong number.** Until 2026-08-12 an income landing exactly on a Medicare threshold was charged the higher tier. It was corrected, and the table below now exists so it cannot happen quietly again: every one of these boundaries has a test case sitting exactly on it, another on the far side, and the agency's own comparative wording recorded beside it. A case whose expected value was read off this app's own output is refused the authority-validated label outright.

| Threshold | An exact landing falls | What the authority says |
|---|---|---|
| $109,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Less than or equal to $109,000" |
| $137,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $109,000 and less than or equal to $137,000" |
| $171,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $137,000 and less than or equal to $171,000" |
| $205,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $171,000 and less than or equal to $205,000" |
| $500,000 — the top tier begins | in the upper band | "Greater than or equal to $500,000" |
| $218,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Less than or equal to $218,000" |
| $274,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $218,000 and less than or equal to $274,000" |
| $342,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $274,000 and less than or equal to $342,000" |
| $410,000 — Part B premium and Part D surcharge jump a whole tier | in the lower band | "Greater than $342,000 and less than or equal to $410,000" |
| $750,000 — the top tier begins | in the upper band | "Greater than or equal to $750,000" |
| $109,000 — the separate lived-with-spouse table jumps straight to its middle band | in the lower band | "Less than or equal to $109,000" |
| $391,000 — the separate lived-with-spouse table reaches its top band | in the upper band | "Greater than or equal to $391,000" |
| $62,600 — the premium tax credit disappears entirely — a cliff, not a taper | in the lower band | "At least 300% but not more than 400% (Rev. Proc. 2025-25 Sec. 3.01 applicable-percentage table), and an applicable taxpayer is one whose household income "equals or exceeds 100 percent but does not exceed 400 percent" of the poverty line (26 U.S.C. Sec. 36B(c)(1)(A))" |

Thresholds deliberately not in that table, because landing exactly on them gives the same answer either way:

- **Federal ordinary income tax bracket edges, all four filing statuses** — Each rate applies only to the excess above its own floor, so taxable income landing exactly on a bracket edge produces identical tax whichever band claims it — the excess is zero either way.
- **Long-term capital gains rate breakpoints** — Same piecewise structure as the ordinary brackets: the 15% and 20% rates apply only to the gain above each breakpoint, so a taxable income landing exactly on one is taxed identically whichever band claims it.
- **Net investment income tax thresholds ($200,000 / $250,000 / $125,000)** — IRC §1411 applies 3.8% to the LESSER of net investment income or the excess of MAGI over the threshold. At exactly the threshold the excess is zero, so the tax is zero under either reading. Verified at all three points by FED-2026-012.
- **Social Security taxability bases ($25,000 / $32,000) and upper thresholds ($34,000 / $44,000)** — IRC §86 taxes 50% of the excess over the base, then 85% of the excess over the upper threshold. Exactly at a base, the excess is zero and nothing is taxable — the same answer whichever side claims it.
- **The Social Security taxable maximum and the FICA wage base** — A ceiling on what is taxed, not a selector. Earnings exactly at the base are fully taxed under either reading; the next dollar is not taxed under either.
- **The SSA retirement earnings test exempt amounts** — Withholding is $1 for every $2 (or $3) of earnings ABOVE the exempt amount. At exactly the exempt amount the excess is zero.
- **OBBBA senior deduction and itemized deduction phase-out bands** — Phase-outs reduce an amount per dollar of income above a floor. Exactly at the floor, the reduction is zero.
- **Georgia retirement-income exclusion tiers (62, 65)** — Selected on AGE, where statutes are worded inclusively — O.C.G.A. §48-7-27(a)(5): "65 or older", "ages 62-64". The engine's "or older" comparison is correct here; the dollar-band convention that went wrong is the opposite one.
- **Colorado pension/annuity subtraction tiers (55, 65)** — Selected on AGE, where statutes are worded inclusively — C.R.S. §39-22-104(4)(f): "65 or older", "55 through 64". The engine's "or older" comparison is correct here; the dollar-band convention that went wrong is the opposite one.
- **Virginia age deduction (65)** — Selected on AGE, where statutes are worded inclusively — Code of Virginia §58.1-322.02: "age 65 or older". The engine's "or older" comparison is correct here; the dollar-band convention that went wrong is the opposite one.
- **South Carolina retirement deduction (65)** — Selected on AGE, where statutes are worded inclusively — S.C. Code Ann. §12-6-1170(B): "aged 65 or older". The engine's "or older" comparison is correct here; the dollar-band convention that went wrong is the opposite one.
- **New York pension and annuity exclusion (59½)** — Selected on AGE, where statutes are worded inclusively — NY Tax Law §612(c)(3-a): "59½ or older for the entire tax year" — modeled at 60, a documented simplification rather than a boundary question. The engine's "or older" comparison is correct here; the dollar-band convention that went wrong is the opposite one.

## Known limitations — what this app does not (yet) model

Being upfront about gaps is part of being trustworthy about what's verified. None of these are silent — each is a deliberate, documented scope decision, not an oversight discovered by a user.

- The app cannot tell you how long you will live. Your planning horizon is something you set. The app uses published life-expectancy tables to suggest a starting point and to compare claim ages, but it never predicts your own lifespan. Since 2026-08-09 the claim-age comparison can also report how often one age beat the other across hundreds of sampled lifetimes as well as hundreds of market histories — a probability rather than a prediction, offered beside the deterministic answer and never in place of it. Matters when you are comparing options whose ranking depends on living longer or less long.
- A stream's first and last year is prorated by whole months. When an income stream starts or stops mid-year, the app counts the months it was active and takes that share of the annual amount. Matters when a stream pays in a few large installments rather than monthly.
- Two kinds of state retirement relief this app cannot apply. Every state that taxes income, and the District, has had its retirement-income treatment read from its own statute or revenue department. Most are modeled. Two groups are not, for two different reasons. The app cannot express the relief in Arizona, Idaho, Indiana, Massachusetts, Minnesota, Missouri, Montana, Nebraska and North Carolina, because those states relieve retirement income by its SOURCE — a state or local government pension, a particular retirement system, service before a given year — and a plan records what an account is, not which employer it came from. And Michigan and Rhode Island have not yet published the figure for this tax year, so their cap is left unapplied rather than carried forward at last year's amount. All eleven are treated as taxing retirement income in full. Matters when you live in one of the eleven and draw a pension, or draw retirement income in Michigan or Rhode Island.
- The strategy search tries a shortlist, and does not prove anything is best. The Strategy Search scores four decisions together — when to claim Social Security, what to convert to Roth, which accounts to draw from and which spending rule to follow — by running a full projection for each combination it considers. It does not consider every combination. It works through the claim ages and conversion policies in full, takes the strongest of those forward against the withdrawal orders, then against each spending rule, and stops at a work limit that is stated on screen alongside the count of projections it actually ran. Your retirement year is a frame it runs inside rather than an axis it sweeps. Matters when you are choosing between rows that sit close together, or you have a strategy in mind that is not on the list.
- An income rider's arithmetic is not validated against any contract. The app models a Guaranteed Lifetime Withdrawal Benefit from the figures you enter: the benefit base rolls up while income is deferred, the rider fee is charged as a percentage of that base and taken out of the account value, income starts at the age you set and is fixed at your payout factor times the base, and once the account is empty the payments continue as the insurer's obligation. Every one of those steps follows the design's reading of how these contracts work — not a carrier's contract that anybody has checked it against. Matters when you hold a contract with a living benefit and are relying on the projected income rather than on your carrier's illustration.
- Donating appreciated shares is not modeled. Charitable giving is modeled as cash, as an itemized deduction, or as a distribution straight from a retirement account. Giving shares that have grown in value is not compared. Matters when you give from a taxable account holding a large unrealised gain.
- Itemized deductions are entered by hand, not derived. Mortgage interest, state and local tax, charitable giving and medical expenses are annual figures you type. Mortgage interest is not calculated from a tracked mortgage balance, and county or city tax is not folded into the state-and-local figure. Matters when your itemized deductions are close to the standard deduction.
- The claim-age search resolves to one lifespan, not a range of them. Every claim-age pair is projected against the lifespan your plan states — a death you have entered if you entered one, otherwise the horizon you set. It is a thorough search along every other axis: every month from 62 through 70 for both of you, each one a complete projection, and since 2026-08-12 each one scored on what is left at the end, on what you get to spend, and on whether the plan ever falls short. What it does not do is re-run that search across a range of lifespans and weight the answers by how likely each is. Matters when your real lifespan differs materially from the one your plan states, and the surface around the best pair is a ridge rather than a plateau.
- The household claim-age grid is drawn in whole years. The matrix of claim-age pairs you read is nine ages by nine ages. Claiming is a monthly decision, so the full picture would be ninety-seven by ninety-seven, and that is not something anybody reads. A button searches every month between 62 and 70 and reports the best pair it finds, which you can apply — but the colored grid itself stays in whole years. Matters when you read only the colored grid and never press "Search every month".
- The household claim-age grid counts Social Security dollars only. The colored grid scores lifetime benefits from a closed-form calculation. It does not run the projection, so on its own it cannot see the earnings test withholding a benefit while you are still working, the tax on the benefit itself, or the Medicare surcharge a bigger benefit can trigger. Since 2026-08-09 that grid is the first of two stages: "Rank the best pairs through the whole plan" takes the best pair from each region of it, re-simulates your entire plan once for each, and ranks those on what the household is left with — which does see all three. Matters when you claim before full retirement age and keep earning, and you read the grid without running the full-plan ranking below it.
- The claim-and-conversion search tries a shortlist of claim ages, not all of them. Solving the claim age and Roth conversions together means one full projection per combination, so the claim ages it crosses with the conversion strategies are a shortlist: the pairs the household grid rates highest, claiming as early as possible, claiming at full retirement age, claiming at 70, and whatever your plan says today. A claim age outside that list is never priced against a conversion schedule, however well it might have done. Matters when your best claim age is driven by a tax feature the benefit-dollar grid cannot see and does not fall on one of the reference points.
- The instant claim-pair ranking samples — and the app will show you exactly what that costs. The full-plan ranking under the household grid does not simulate every claim-age pair. The closed-form grid picks the candidates — the best month inside every whole-year region of it, plus the pair your plan already uses — and only those are re-simulated. Which MONTH represents a region is chosen on Social Security dollars, so where the full projection would have preferred a different month of the same year, that month is never proposed. Since 2026-08-10 the search also scores against a death your plan states, if it states one, rather than assuming both of you live to the end age, and it will not propose a claim age someone does not live to reach. THIS LIMITATION HAS AN ESCAPE HATCH, which is unusual for anything in this register: the Every Claim Age, Checked screen runs the full projection on all 9,409 pairs with no shortlist at all, and when it finishes it names the pair the instant search picked, the best pair that exists, and the difference between them in dollars — for your household, not for an example. You do not have to take this disclosure on trust; you can measure it. Matters when the tax picture, not the benefit total, is what decides the claim age for your household — and you can settle it either way by running the exhaustive search.
- A Social Security benefit entered as a plain amount tells us less about a survivor. When you enter Social Security as a full-retirement-age benefit plus a claim age, a survivor's benefit gets both of the rules Social Security applies: the survivor's own reduction for claiming early, and the limit that protects them when the person who died had claimed early. When you enter it as a plain monthly amount instead, only the first of those can be applied — the second is measured against a figure the plan does not have. Matters when the person who died had claimed well before their own full retirement age.
- A child's Social Security is counted as the parent's income for tax. A benefit paid on a parent's record to their child is legally the child's income, and a child with little other income usually owes no tax on it. This app counts it with the parent's, because a plan describes one household of at most two adults and has nowhere to put a third person's tax return. Matters when a child's benefit is a large share of household income, which is when the family maximum is binding.

## How to check this yourself

Every case's exact inputs, expected value, actual engine output, and source citation — including the exact quote pulled from the original government publication — is in this project's public repository under `app/src/engine/validation/`. The full technical report (diff tables, tolerances, per-field results) is attached alongside this document.
