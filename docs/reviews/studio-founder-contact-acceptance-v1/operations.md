# Operations and recovery — Task 17

**Status: recorded 2026-10-19 for the released direct-contact site. Nothing here was executed; no rollback was needed.**

## What is running

The site is a static export. A push to `main` runs `.github/workflows/deploy.yml` (Node 24, `NEXT_PUBLIC_BASE_PATH=/<repository name>`) and publishes `out/` to the `gh-pages` branch for GitHub Pages. It has no backend, form endpoint, provider account, secret, inbox integration or stored data of its own. Contact is three native links; messages are composed and kept in WhatsApp, the visitor's email service or the phone, and Samuel receives them in Gmail, WhatsApp and the phone.

## Recovery

Only Samuel (the owner) deploys or rolls back; `main` stays human-controlled. If a material public route, link or disclosure failure is found:

1. Preserve evidence (URL, time, deployed SHA from `gh-pages`, the failing observation).
2. Assign a bounded remediation as its own numbered task with its own RED and review, unless the failure is serious enough to roll back first.
3. Whole-release rollback, either route, performed by Samuel:
   - Re-run the prior deploy: `gh run rerun 38728080880 --repo Furlanich/Portfolio`. It republishes `cd8c0d45`. The run exists, succeeded and is within GitHub's re-run window as of 2026-10-19 (the window is 30 days from the original run, so until about 2026-11-14); after that, use the second route.
   - Or revert merge commit `5d8055a3` on `main` through a human-reviewed change; the push redeploys.

Rolling back restores the coherent earlier site, including its local-demonstration Contact form and its demonstration Privacy copy, and removes the Terms pair. That state sends and stores nothing, but it is not the product the owner approved on 2026-10-18, so a rollback is a stop-gap while a fix is prepared. It does not change any message already sent to Samuel through a direct channel.

## Not applicable under the direct-contact decision

Formspree quota, Spam and Over Limit review, dashboard monitoring, a 75% response alert, an approved retention runbook, provider deletion exceptions and a counsel-approved disclosure review. None was supplied or inferred, none is reported PASS, and the Privacy text promises none of them. Responding to messages and data requests at `samuelfurlanich@gmail.com` is Samuel's own practice; this repository records no schedule for it, and the "usual response" wording on Contact is an expectation, not a service level.

## Checking again

The read-only checks in [task-17.md](task-17.md) repeat in minutes: compare the live pages with `git archive origin/gh-pages`, run `verify-static-export.mjs` with `STATIC_EXPORT_DIR` and `NEXT_PUBLIC_BASE_PATH=/Portfolio` from PowerShell (Git Bash rewrites `/Portfolio` into a Windows path and produces false failures), and read the DOM of both Contact pages. Do not send a message or place a call to test a link.
