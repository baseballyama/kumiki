# Security policy

## Supported versions

Kumiki is in pre-alpha. There are no supported versions yet. Once we ship a `1.0.0`, this section will list the support window.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead, email the maintainer at the address listed in the [GitHub profile](https://github.com/baseballyama), or use GitHub's [private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).

We aim to acknowledge reports within **3 business days** and to triage within **10 business days**. Critical fixes ship before a coordinated disclosure window of 30 days; lower-severity issues ship in the next regular release.

## Scope

In scope:

- Logic bugs in machines / attachments / components that lead to ARIA mis-announcement, focus-trap escape, dismissable bypass.
- Supply-chain risks in any `@kumiki/*` package.
- Code-injection vectors in the `@kumiki/cli` (e.g. arbitrary file write outside `cwd`).

Out of scope:

- Third-party validation libraries plugged into `withValidation`.
- Apps that consume Kumiki — please report to the app's maintainer.
