# October 2026 runtime and framework security upgrade

Verified on 2026-10-22. Implementation baseline: `8d181af`.

## Versions

- All Docker stages: Node `26.12.1`, Alpine `3.24`, pinned to the official multi-architecture manifest digest.
- Next.js and `@next/mdx`: `16.4.2`. October security fixes first shipped in `16.4.1` and `15.5.28`.
- React, React DOM, and react-is: `19.3.1`, including the October RSC patches.
- Sharp: `0.35.5`.
- Backend JSON Web Token library: `jsonwebtoken@9.0.3`. Its updated JWA dependency avoids SlowBuffer APIs removed in Node 26.
- Backend npm: `12.2.1`; Corepack: `0.36.0`; Yarn remains the repository-pinned `4.1.1`.
- FFmpeg 6 Alpine packages: `6.1.4-r2`.

Sources: [Node security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases), [Next security release](https://nextjs.org/blog/nextjs-security-update-october-14-2026), [React RSC advisory](https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3), [JWT compatibility issue](https://github.com/auth0/node-jsonwebtoken/issues/992).

## Migration decisions

- Request cookies and route parameters are asynchronous. All token-helper callers await the token.
- Server Actions use `updateTag` to preserve immediate mutation visibility. React form state uses `useActionState`; imperative actions run inside a transition.
- `middleware.ts` becomes `proxy.ts`.
- MDX keeps the webpack path for dev, build, and preview. Next 16 defaults to Turbopack, which cannot serialize the current remark plugin functions.
- Removed the old experimental PPR flag. Ordinary dynamic SSR and existing Suspense boundaries remain; adopting Cache Components is a separate architecture change.
- Production builds check TypeScript. The typecheck command generates current Next route types first.
- Replaced React-18-only Tremor with typed chart components using Recharts, SVG meters, and the existing progress component.
- Shared upload dispatch preserves the concurrency-10 queue and handles each file failure independently.
- Comparison images wait for settings and use the library image component for correct sizing.
- Removed npm from the standalone frontend runtime. The backend keeps npm because runtime Prisma migrations invoke `npx --no-install`.
- Updated compatible vulnerable transitive dependencies in the existing dependency ranges. Removed the unused Sharp stub type dependency that pulled an old Sharp binary into the backend.

## Validation

- Immutable Yarn install.
- Frontend lint, route type generation, typecheck, and production build.
- Backend TypeScript build and Prisma client generation.
- Both Dockerfiles built for `linux/amd64` and `linux/arm64`.
- ARM64 full stack booted behind the existing Caddy configuration using isolated test volumes.
- Fresh amd64 backend booted with an empty database volume, ran migrations, and passed settings and login API checks; amd64 frontend returned HTTP 200.
- Runtime probes confirmed Node `26.12.1`, Next `16.4.2`, React/DOM `19.3.1`, Sharp `0.35.5`, and working JWT sign/verify.
- Browser: login; settings save; mixed image/video uploads; image/video thumbnails; album create and upload; tag and snippet creation; public album and public snippet views; account and admin tables; invite creation; file deletion with confirmation; selection and bulk thumbnail regeneration; image comparison; statistics charts; FAQ MDX.
- Upload failure/concurrency check: temporarily configured 1 KiB chunks and a 4 KiB limit in the isolated instance. Selected an oversized 5 KiB file first, followed by two 3 KiB files. Only the oversized file was rejected, both valid files completed, and backend request logs showed interleaved chunks. Original limits were restored.
- Clipboard file upload passed.
- Mobile 390 x 844 viewport: tag drawer creation passed.
- Open Graph image generation and Next image optimization returned HTTP 200 with valid PNG output.
- Two independent adversarial reviews found upload serialization and preview command issues; both were fixed and independently re-reviewed.

The complete backend lint command remains blocked by existing formatting in `UpdateAlbum.ts`, `DownloadFile.ts`, and `GetSettings.ts`. Running backend ESLint directly reports 21 existing issues in unchanged files, chiefly migration helpers and import order. The changed backend files do not appear in that failure list. The original frontend had three unused-symbol type errors and lint failures; the upgraded frontend passes.

S3 storage was not configured for this validation. Its signed-upload branch is preserved structurally, but an actual S3 upload was not exercised. Mobile checks use a Chromium viewport, not a real iOS device.

## Remaining security findings

Trivy scan results for the upgraded ARM64 images: frontend **0** findings; backend **45** findings: **24 high, 18 medium, 3 low, 0 critical**. These counts depend on the scanner database date. A clean frontend scan does not establish that every backend dependency is patched.

Remaining high-severity package groups:
- `@fastify/static`: CVE-2026-15074.
- `adm-zip`: CVE-2026-102282, CVE-2026-39244, CVE-2026-77301, GHSA-8238-w5pm-2374, GHSA-rcw4-f5rp-g42v.
- `braces`: CVE-2026-93687.
- `fastify`: CVE-2026-25223, CVE-2026-76169, CVE-2026-84428, CVE-2026-84469, CVE-2026-84504.
- `find-my-way`: CVE-2026-47219.
- `ghtml`: CVE-2024-37166.
- `glob`: CVE-2025-64756.
- `minimatch`: CVE-2026-26996, CVE-2026-27903, CVE-2026-27904.

Several remaining fixes require a separate migration, notably Fastify 4 and its plugin ecosystem, and the old ZIP/HTML helpers. Other findings are in bundled build or development dependencies.

Two follow-up options:

1. Retain this focused runtime/framework upgrade: no further implementation effort, low additional regression risk, but the listed backend findings and maintenance debt remain.
2. Upgrade the backend framework/plugins and vulnerable helpers, then split or prune the backend runtime dependencies: moderate to high effort and API/native-module compatibility risk, broader backend testing required, lower ongoing security maintenance burden.

Recommend option 2 as a separate reviewed change after this urgent runtime/framework upgrade.

To reproduce scans after building the images, use `trivy image --scanners vuln IMAGE_TAG` and `yarn npm audit --all --recursive`. Keep the full reports with the build artifacts.
