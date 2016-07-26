# Rafflecopter System Status

## Usage

To indicate a problem with one of the systems, [open a new issue](https://github.com/Rafflecopter-Status/rafflecopter-status.github.io/issues) and
use the appropriate labels for the affected service(s) and severity levels.

Then run `npm run build`, commit, and push. Everything happens on `master` branch.


## Development

`npm install` the first time to get started

- `npm run build` to build a static version of the site
- `npm run serve` to build once and serve locally at [localhost:1337](htt://localhost:1337)

## Notes

The builder is written to work both in the browser and in node. When in node, it will look
at the environment variable `STATUSPAGE_TOKEN` to try to make an authenticated request. You don't
need this unless you're hitting rate-limiting issues.

When in the browser, the page will re-render once every 2 minutes. GitHub's non-authenticated
API rate limit is one request per minute, so we double that to be friendly.
