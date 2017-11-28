# Overseas Market Introduction Service (OMIS) frontend

[![CircleCI](https://circleci.com/gh/uktrade/omis-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/omis-frontend)
[![Dependency Status](https://gemnasium.com/badges/github.com/uktrade/omis-frontend.svg)](https://gemnasium.com/github.com/uktrade/omis-frontend)

An express application that fetches data from a JSON based API and handles
the rendering and processing of forms and data.

In order to use the application the frontend layer must be run, with a small
number of settings, and be provided with an API service.

## Dependencies

- [Node.js v8.5](https://nodejs.org/en/)
- [NPM v5](https://github.com/npm/npm)

## Installation

1. Clone repository:

  ```
  git clone https://github.com/uktrade/omis-frontend
  ```

2. Install node dependencies:

  ```
  npm install
  ```

3. Build assets

  ```
  npm run build
  ```

4. Run application

  ```
  npm start
  ```

## Development

### Run in development mode

You can run the server in develop mode. Develop mode auto restarts
the node server if you make any changes to it and if you connect to the server
using [http://localhost:3001](http://localhost:3001) this will use
[browser-sync](https://www.browsersync.io/) to automatically show
any changes instantly in the browser.

To run develop mode:

```
npm run develop
```

In addition you can build the code yourself:

```
npm run build
```

or lint the code for styleguide warnings and errors:

```
npm run lint
```

### .env file

`npm run develop` command pre-loads local ENV variables from `.env` file (ignored by Git) before running development server.
If you need to include local environment variables in development add them to `.env` file in the root of the app directory in the following format:

```
VARIABLE_NAME=value
```

There's an `.env.example` with pre-populated development data including urls to the Content Store. It's set to use the `file` system if the Content Store is not available.

To use that, copy the file:

```
cp .env.example .env
```

### Environment variables

Environment variables are used to set application level settings for each
environment.

| Variable | Description | Default |
|:---------|:------------|:--------|
| `NODE_ENV` | Node environment | development |
| `SERVER_HOST` | server hostname | localhost |
| `SERVER_PORT` or `PORT` | server port | 3000 |
| `SERVER_WORKERS` or `WEB_CONCURRENCY` | number of workers | dependant on CPU |
| `CACHE_VIEWS` | whether to cache Nunjucks views | false |
| `SESSION_SECRET` | secret used by session store | |
| `SESSION_TTL` | session expiration | 2 hours |
| `LOG_LEVEL` | level of logs to output to console | warn |
| `API_ROOT` | root for API | http://localhost:8000 |
| `API_AUTH_URL` | auth endpoint for API | /token/ |
| `API_CLIENT_ID` | auth client ID | |
| `API_CLIENT_SECRET` | auth client secret | |
| `API_CLIENT_SCOPE` | auth client scope | |
| `SENTRY_DSN` | sentry data source name | |
| `GOOGLE_TAG_MANAGER_KEY` | key for Google Tag Manager | |
| `GOOGLE_TAG_MANAGER_SUFFIX` | value to append to Google Tag Manager key | |


### Testing

#### Unit tests

Unit tests are located in `./src/test/`. They are run using the [Jasmine](https://jasmine.github.io/) framework.

To run unit tests:

```
npm run test:unit
```

### Continuous integration

Tests and code linting are all run on [CircleCI](https://circleci.com/).

## Deployment

Commits to `develop` are automatically deployed to a Heroku instance. Pull
requests deploy to a [review app](https://devcenter.heroku.com/articles/github-integration-review-apps)
from this Heroku instance.

Deployments to staging and production are done manually through Jenkins and are
deployed from the `master` branch.
