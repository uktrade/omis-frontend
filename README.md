# Overseas Market Introduction Service (OMIS) frontend

[![CircleCI](https://circleci.com/gh/uktrade/omis-frontend.svg?style=svg)](https://circleci.com/gh/uktrade/omis-frontend)

An express application that fetches data from a JSON based API and handles
the rendering and processing of forms and data.

In order to use the application the frontend layer must be run, with a small
number of settings, and be provided with an API service.

## Dependencies

- [Node.js v20.4.0](https://nodejs.org/en/)

## Installation

1. Clone repository:

```
git clone https://github.com/uktrade/omis-frontend
```

2. Install node dependencies:

```
nvm use 20.4.0
```

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

### .env file

`npm run develop` command pre-loads local ENV variables from `.env` file (ignored by Git) before running development server.
If you need to include local environment variables in development add them to `.env` file in the root of the app directory in the following format:

```
VARIABLE_NAME=value
```

There's an `.env.example` with pre-populated development data including urls to the Content Store. It's set to use the `file` system if the Content Store is not available.

To use that, copy the file:

```
cp .env.sample .env
```

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

### Running against a local API instance

It is possible to run the service against a local instance of the Data Hub API following these instructions. Note that you will need local copies of the DH API and Frontend. The frontend should be pointing to the local API instance rather than an external environment.

2. Add the variables `OMIS_PUBLIC_ACCESS_KEY_ID` and `OMIS_PUBLIC_SECRET_ACCESS_KEY` to the API's `.env` file (the values are in Vault). Once you have done this, bring up the API.
3. Bring up the frontend, navigate to the 'Orders' tab and create an OMIS order.
4. Add an 'Adviser in the market', set it as the lead adviser and add some estimated hours.
5. Click on 'Preview quote' and complete the fields that show as incomplete (helpfully it won't tell you about any of the items from Step 3 being missing so that needs to be done first).
6. When all fields are filled in, click 'Preview quote' again, scroll down to the bottom of the page and click 'Send quote to client'.
7. Create a copy of this project's `.env` file if you haven't already done this

```
cp .env.sample .env
```

8. Open this project's `.env` file and make the following changes:

- `API_ROOT` should be set to `http://localhost:8000`
- `API_CLIENT_HAWK_ACCESS_KEY_ID` should be set to the same value as `OMIS_PUBLIC_ACCESS_KEY_ID` in the API
- `API_CLIENT_HAWK_SECRET_ACCESS_KEY` should be set to the same value as `OMIS_PUBLIC_SECRET_ACCESS_KEY` in the API
- `SERVER_PORT` should be set to `4000` (this is because the API expects the OMIS service to be running on this port)

9. Start this project with `npm run develop`. Note that the console will tell you that the service is running on port 3000 when it's actually running on 4000.
10. Open up the API admin screen and navigate to the `Orders` interface. Open the order created in step 2 and click on the `Public facing URL`, which will open the order within this microservice.

### Running against an external API

It is also possible to run this service against an external Data Hub enrivonment (such as dev/staging). You don't need to have any other DH projects running to do this.

1. Create a copy of the `.env` file if you haven't already done this (use the command from step 7 above)
2. Set the `API_ROOT` variable to the correct URL for the environment you want to use (you can get this from the playbook or from the DH frontend's `.env` file if you run that project in this manner).
3. Set the `API_CLIENT_HAWK_ACCESS_KEY_ID` and `API_CLIENT_HAWK_SECRET_ACCESS_KEY` with the correct values from Vault.
4. Open the relevant frontend and follow steps 4-6 from the local API instructions to generate an order.
5. Open the relevant Django Admin interface, navigate to your order and copy the public token.
6. Start this project by running `npm run develop`. Paste the public token at the end of the URL (e.g. `localhost:3000/your_token`). You should now be able to interact with your order within the local frontend.

### Running in Docker

Prerequisite: Ensure `data-hub-api` is sitting in the same directory as `omis-frontend`
Open this project's `.env` file and make the following changes:

- `API_ROOT` should be set to `http://docker.for.mac.localhost:8000`

#### Bring up the Dev environment

    make start-dev          // bring up the containers
    make stop-dev           // stop and remove the containers

Once the containers are up, go into the django admin: `http://localhost:8000` and go the orders list. Click on an order and click the public facing url. This should take you to the Omis order in the browser.

### Environment variables

Environment variables are used to set application level settings for each
environment.

| Variable                              | Description                               | Default               |
| :------------------------------------ | :---------------------------------------- | :-------------------- |
| `NODE_ENV`                            | Node environment                          | development           |
| `SERVER_HOST`                         | server hostname                           | localhost             |
| `SERVER_PORT` or `PORT`               | server port                               | 3000                  |
| `SERVER_WORKERS` or `WEB_CONCURRENCY` | number of workers                         | dependant on CPU      |
| `CACHE_VIEWS`                         | whether to cache Nunjucks views           | false                 |
| `SESSION_SECRET`                      | secret used by session store              |                       |
| `SESSION_TTL`                         | session expiration                        | 2 hours               |
| `LOG_LEVEL`                           | level of logs to output to console        | warn                  |
| `API_ROOT`                            | root for API                              | http://localhost:8000 |
| `API_CLIENT_HAWK_ACCESS_KEY_ID`       | hawk client access key id                 |                       |
| `API_CLIENT_HAWK_SECRET_ACCESS_KEY`   | hawk client secret access key             |                       |
| `SENTRY_DSN`                          | sentry data source name                   |                       |
| `GOOGLE_TAG_MANAGER_KEY`              | key for Google Tag Manager                |                       |
| `GOOGLE_TAG_MANAGER_SUFFIX`           | value to append to Google Tag Manager key |                       |

### Testing

#### Unit tests

Unit tests are located in `./src/test/`. They are run using the [Jasmine](https://jasmine.github.io/) framework.

To run unit tests:

```
npm run test:unit

```

#### Start the E2E tests - ACTUAL RUNNING OF THESE TESTS YET TO BE IMPLEMENTED

    make start-e2e          // bring up the containers
    make e2e-tests          // run the tests inside the container
    make stop-e2e           // stop and remove the containers

### Continuous integration

Tests and code linting are all run on [CircleCI](https://circleci.com/).

## Deployment

Deployments to staging and production are done manually through Jenkins and are
deployed from the `master` branch.

Please use the same process as the [Data Hub frontend](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Deployments.md)
