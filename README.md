# Piano & lyrics

Single-track Next.js 16 player with synchronized lyrics and a glass interface over the supplied background photograph.

## Run

Requires Node.js 20.9+.

```sh
npm install
npm run dev
```

Open http://localhost:3000. Production: `npm run build`, then `npm start`.

Lyrics and finalized timestamps come directly from `data/lyrics.json`. The synchronization editor has been removed. Audio is served from `public/audio/music.wav`, and the background from `public/images/background.jpg` (copied from `data/background.jpg`). Browser drafts no longer override the bundled timing.

Space plays/pauses, left/right seek 5 seconds, and up/down adjust volume. Inputs and buttons retain native keyboard behavior. Clicking lyrics seeks without changing playback state. Manual browsing pauses lyric following for 3 seconds; Return to current line resumes immediately.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

## GitHub Pages deployment

1. Push this repository to GitHub, including `package-lock.json` and `public/` assets.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Push to `main` or run **Deploy to GitHub Pages** from the Actions tab.

The workflow tests the app, exports it into `out/`, and deploys that artifact. The deployment URL appears in the workflow environment. No personal access token is needed. If your default branch changes, update the workflow's `push.branches` value.

The Pages base path is read from `actions/configure-pages`, so repository sites, account sites, and configured custom domains use the correct audio, background, and Next.js asset URLs. Development and ordinary production builds keep the existing Next.js server behavior.

To verify the static build locally with a repository subpath:

```sh
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/music npm run build
```

The output is static; serve it with a static HTTP server under `/music/` rather than using `next start`. A normal `npm run build` restores server mode for `npm start`.
