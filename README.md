# Competitor Radar

Vue 3 + Vite SPA for an AI travel competitor radar panel.

## Local development

```bash
PATH=/Users/qinlinbo/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:/Users/qinlinbo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH pnpm dev
```

## GitHub Pages

The app is configured for the repository path `/08/`, so it can be deployed to:

`https://qlb708.github.io/08/`

Deployment is handled by [deploy-pages.yml](/Users/qinlinbo/Documents/圆周/.github/workflows/deploy-pages.yml).

## Data refresh

```bash
pnpm radar:generate
pnpm radar:sync
pnpm radar:push
```

The updater writes both `competitor-radar/data.json` and `public/competitor-radar/data.json`, then pushes the repository copy through the GitHub Contents API.
