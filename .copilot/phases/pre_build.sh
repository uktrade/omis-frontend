#!/usr/bin/env bash

# Exit early if something goes wrong
set -e

# Add commands below to run as part of the pre_build phase

# The build system requires a Procfile be present
echo "web: npm start" > Procfile
