SHELL = /bin/bash

CURRENT_UID := $(shell id -u)
CURRENT_GID := $(shell id -g)

export CURRENT_UID
export CURRENT_GID

docker-e2e = docker-compose -p omis-frontend -f docker-compose.yml

ifdef CI
	start-command = up --build --force-recreate -d
	cypress-args = -- --parallel --record --key $(CYPRESS_DASHBOARD_KEY) --ci-build-id $(CIRCLE_BUILD_NUM)
	log-command = logs --follow
else
	start-command = up --build --force-recreate
	cypress-args =
	log-command = version
endif

start-e2e:
	@echo "*** To stop this stack run 'make stop-e2e' ***"
	$(docker-e2e) $(start-command)

stop-e2e:
	docker-compose down -v --remove-orphans
