Deploying the Portfolio (quick guide)

1) Local preview

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

2) GitHub Pages (recommended)

- Push this repo to GitHub (your `main` branch).
- The included GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) will publish the repository root to the `gh-pages` branch automatically on push.
- After the first successful run, go to GitHub repository Settings → Pages, and set the source to `gh-pages` branch (root).

3) If the Action does not have permission to publish, create a Personal Access Token (PAT) with `repo` scope and save it as repository secret `GH_PAT`, then update the workflow to use it.

Notes:
- The workflow uses `peaceiris/actions-gh-pages` and the provided `GITHUB_TOKEN` which usually works for publishing to `gh-pages` for public repositories.
