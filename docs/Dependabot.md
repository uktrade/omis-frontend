# Managing Dependabot PRs

This is the process we have identified for dealing with Dependabot PRs that saves developer time and CircleCI resource.

1. Create a new branch called `chore/dependencies-[yyyy-mm-dd]`, inserting today’s date.
2. Open each Dependabot PR and check that the tests have passed. Re-run any failing tests as the majority of failures are caused by timeouts or flakiness.
3. Once all tests have passed, edit the PR so that the base branch is the `chore/dependencies` one. You should now be able to merge the PR without needing to request reviews.
4. Repeat steps 2 and 3 until all PRs are either merged or identified as needing further work. Any PRs with consistently failing tests can be passed to the Technical Excellence team if required.
5. Checkout the `chore` branch to your local machine.
6. After all the PRs have been merged and any additional changes have been made, run `npm install`. Ensure that any changes to `package-lock.json` are included in your branch.
7. Bring the service up locally following the documentation.
8. Go to the relevant frontend environment (this will be different depending on how you are running the project) and create an order.
9. Fill in all information listed in the 'To preview the quote' box. It doesn't matter what you put here. Click on the 'Preview quote' button once this is done.
10. On the quote page, scroll down to the bottom and click 'Send quote to client'.
11. In the relevant Django Admin environment, go to the Orders section and find your order (you'll need the reference number, which is available on the main FE page for your order).
12. Open the 'public facing URL'.

If you're running against a live environment, replace the environment domain with `localhost:3000` (or whatever port you are running the project on). The URL should look like `localhost:3000/Qd9AyojGFEISUEEvPzzOY4P3g1qU9jiHK9wOlcGEw5NDcvX0pw`. Navigate to this page.

13. The quote page should render correctly. If it doesn't, stop where you are contact the Platform Enhancements team for guidance.
14. Rebase the dependency branch against `master` to remove all the merge commits, then push the changes and open a PR.
15. If you are satisfied that everything is in order and all the tests have passed, request reviews as normal.
16. Ensure that the dev deployment has succeeded. If they haven't, notify the Platform Enhancements team.

## Cypress

When Cypress is updated, the Cypress version used in [`Dockerfile.dependencies`](../Dockerfile.dependencies) needs to be updated as well.

> The process is the same for Data Hub Frontend. To setup Google Cloud CLI, request access to the container registries, or if you are having issues, please read [`Docker.md`](https://github.com/uktrade/data-hub-frontend/blob/main/docs/Docker.md#creating-docker-container-for-circleci) in the Data Hub Frontend repo.

First, in `Dockerfile.dependencies`, bump the Cypress version to match that in `package.json`.

```Dockerfile
RUN npm install -g cypress@{INSERT_CYPRESS_VERSION_HERE} \
    ...
```

From the terminal, build the new dependencies image.

```bash
docker build -f Dockerfile.dependencies -t omis-dependencies . --platform linux/amd64
```

Tag the dependencies image with the incremented version.

```bash
export VERSION=2.0.0 # Increment this version each time when you edit Dockerfile.
docker tag omis-dependencies:latest gcr.io/sre-docker-registry/omis-dependencies:${VERSION}
docker tag omis-dependencies:latest gcr.io/sre-docker-registry/omis-dependencies:latest
```

Push the new images to the Google Cloud container registry.

```bash
gcloud auth login
docker push gcr.io/sre-docker-registry/omis-dependencies:${VERSION}
docker push gcr.io/sre-docker-registry/omis-dependencies:latest
```

The new image should now be listed in the [OMIS Google Cloud Container Registry](https://console.cloud.google.com/gcr/images/sre-docker-registry/global/omis-dependencies).

Update the version tag in `Dockerfile`.

```Dockerfile
FROM gcr.io/sre-docker-registry/omis-dependencies:{INSERT_VERSION_HERE}
...
```

Commit the new changes to the `chore/dependencies` branch before raising the main Dependabot PR.

### Bulk upgrade of dependency groups

As with the Data Hub frontend, this project has some dependencies that need to be updated together:

- Sentry (`dependabot:update-sentry`)
