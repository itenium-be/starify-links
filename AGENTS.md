# Agent Instructions

## Code Style

- Do not add comments to code you generate or change
- Never remove existing comments

## E2E Tests

- `*.e2e.spec.ts` run against LIVE third-party sites on purpose: the product is a
  browser extension that badges those real pages, so the tests must keep verifying
  the real DOM. Do NOT mock/stub/HAR them or loosen exact `toHaveCount` assertions
  to hide site drift.
- A failure means either the site changed (update the selector/expectation to match
  reality) or the extension regressed (fix the extension). Investigate which; never
  quarantine to make CI green.
- The nightly `schedule` run is intentional: it catches upstream site changes early.
