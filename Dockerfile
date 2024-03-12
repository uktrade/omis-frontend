FROM node:20.4.0
# ARG CURRENT_UID
# ARG CURRENT_GID

# USER root
# # RUN chown -R $CURRENT_UID:$CURRENT_GID /home/node
# # RUN chown -R $CURRENT_UID:$CURRENT_GID /usr/src/app

# WORKDIR /usr/src/app

# COPY --chown=$CURRENT_UID:$CURRENT_GID package.json .

# ENV NODE_OPTIONS="--max-old-space-size=8192"

# RUN npm install

# COPY --chown=$CURRENT_UID:$CURRENT_GID . .

# CMD npm run develop

WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install

COPY . .
CMD npm run develop