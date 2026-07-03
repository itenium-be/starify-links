# E2E Tests

`tests/*.e2e.spec.ts` drive a real Chromium with the built extension loaded, against
**live third-party sites** (npm, nuget, pypi, DuckDuckGo, GitHub, …). This is on
purpose: the product is a browser extension that badges those real pages, so the
tests must keep verifying the real DOM.

- Do NOT mock/stub/HAR them or loosen exact `toHaveCount` assertions to hide site drift.
- A failure means one of: the site changed (update the query/selector/expectation to
  match reality), the extension regressed (fix the extension), or the harness was
  blocked (bot wall / rate limit). Investigate which — never quarantine to make CI green.
- The nightly `schedule` run in `.github/workflows/playwright-tests.yml` is intentional:
  it catches upstream site changes early.

## Running locally

```
bun run test:e2e                                                       # full suite (builds first)
bun run build && bunx playwright test --project=e2e -g "on DuckDuckGo" # one test (build first)
```

| Flag              | Effect                                              |
|-------------------|-----------------------------------------------------|
| `--workers=1`     | Serial, like CI. Parallel workers hammer shields.io |
| `--repeat-each=5` | Re-run a test to surface flakiness                  |
| `--retries=0`     | Fail fast; don't let retries mask a flake           |

Running many tests in parallel locally floods shields.io and triggers `429` badge
failures that CI (serial, `workers: 1`) does not hit — use `--workers=1` to reproduce
CI conditions.

## What is captured on failure

`tests/test-utils.ts` records the browser console and every shields.io response per
page; on failure `attachDiagnostics` writes them plus a DOM snapshot to
`failure-diagnostics.txt`. Alongside it Playwright keeps a screenshot and the full trace.

```
cat test-results/*/failure-diagnostics.txt                  # the diagnostics
bunx playwright show-report                                 # HTML viewer (screenshots + attachment)
bunx playwright show-trace test-results/<test-dir>/trace.zip # console + network + DOM snapshots
```

`failure-diagnostics.txt` fields:

| Field                     | Tells you                                                        |
|---------------------------|-----------------------------------------------------------------|
| `title` / `url`           | A Cloudflare interstitial (`Just a moment...`) or a redirect     |
| `cloudflareChallenge`     | `true` = the harness hit a bot wall (e.g. StackOverflow)         |
| `shieldsBadgesRendered`   | Which repos actually got badged (a bogus repo → wrong query)     |
| `githubAnchors`           | Whether the expected `github.com` link is even on the page       |
| `shields.io 429 responses`| Rate-limited; the badge retry backoff (30s) delays the badge     |
| `browser console`         | The extension's own `starify-links: Added/Removed N badges` logs |

## Fetching a nightly CI failure

```
gh run list -R itenium-be/github-stars-links --workflow playwright-tests.yml -L 10
gh run view <run-id> -R itenium-be/github-stars-links
gh run download <run-id> -R itenium-be/github-stars-links -D /tmp/e2e-fail
cat /tmp/e2e-fail/playwright-report/data/*.txt                     # failure-diagnostics
grep -rh "^- Name:" /tmp/e2e-fail/playwright-report/data/*.md      # which tests failed
bunx playwright show-report /tmp/e2e-fail/playwright-report        # full viewer
```

The uploaded artifact only exists for failed runs (`if: failure()` in the workflow).

## Common failure signatures

| Signature                                    | Cause                          | Fix                                              |
|----------------------------------------------|--------------------------------|--------------------------------------------------|
| `Received: 0`, `cloudflareChallenge=true`    | Cloudflare bot wall            | Site-level; stealth flags or accept it's blocked |
| `Received: 0`, `shields.io 429 responses > 0`| shields.io rate limit          | `BADGE_TIMEOUT` already waits out one retry       |
| Badge rendered for the wrong repo            | Ambiguous search query         | Use a query whose top GitHub hit is unambiguous  |
| Expected `githubAnchors` entry absent        | Site changed its DOM/results   | Update the expectation or selector               |
| `page.goto: ... has been closed`             | Browser/renderer crash         | Heavy page or a tab leak (see config below)      |

## Config

- `playwright.config.ts` — `retries`, `workers`, `trace: 'retain-on-failure'`.
- `BADGE_TIMEOUT` (in the spec) is `35_000`, just above shields.io's 30s retry backoff
  (`src/badgeRenderer.ts`), so a single `429` recovers within the assertion instead of failing.
- The `afterEach` closes each test's tab (keeping the context's first page alive); a
  persistent context with zero pages shuts the browser down and fails every later test.
