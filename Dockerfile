FROM gcr.io/sre-docker-registry/omis-dependencies:2.1.1

ARG CURRENT_UID
ARG CURRENT_GID

USER root
RUN chown -R $CURRENT_UID:$CURRENT_GID /home/node
RUN chown -R $CURRENT_UID:$CURRENT_GID /usr/src/app

WORKDIR /usr/src/app

# Install dev packages
COPY --chown=$CURRENT_UID:$CURRENT_GID package.json .
COPY --chown=$CURRENT_UID:$CURRENT_GID package-lock.json .

USER "$CURRENT_UID:$CURRENT_GID"

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm install

COPY --chown=$CURRENT_UID:$CURRENT_GID . .

CMD npm run develop
