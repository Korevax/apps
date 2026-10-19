# Security policy

## Reporting a vulnerability

Do not publish credentials, exploit details, private user data or a working exploit in a public issue or pull request.

Use the repository's **Security** tab and GitHub's private vulnerability reporting / Security Advisories feature when available. If private reporting is unavailable, contact the maintainers through a private channel associated with the Korevax GitHub organization and ask for a secure reporting route before sharing technical details.

Include, when safe:
- affected URL, component, commit or version;
- impact and realistic attack scenario;
- minimal reproduction steps or a proof of concept that does not access other people's data;
- logs or screenshots with tokens, personal data and secrets removed.

Maintainers should acknowledge reports, assess severity and affected versions, coordinate a fix, and agree on disclosure timing with the reporter. Do not disclose details publicly before a fix or coordinated disclosure decision.

## Maintainer response checklist

1. Confirm receipt and restrict access to the report.
2. Reproduce the issue in a controlled environment and assess scope/severity.
3. Contain active exploitation: disable the affected route/integration, revoke exposed credentials, or deploy a temporary control as appropriate.
4. Preserve relevant audit evidence without copying unnecessary personal data.
5. Patch and test the issue, rotate affected secrets, and review related logs and systems.
6. Publish a security advisory after coordination; credit the reporter only with consent.
7. Record follow-up actions and verify recovery controls.

## Supported versions

Security fixes target the current default branch and the latest maintained deployment. The project is under active development; deployment-specific support windows will be documented when release versioning is established.
