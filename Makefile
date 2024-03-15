SHELL = /bin/bash

docker-e2e = docker-compose -p omis -f docker-compose.frontend.yml -f docker-compose.backend.yml
docker-dev = COMPOSE_HTTP_TIMEOUT=300 docker-compose -p omis -f docker-compose.frontend.yml

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
	@echo "*** To stop this stack, run 'make stop-e2e' ***"
	$(docker-e2e) $(start-command)
	$(docker-e2e) $(log-command)
start-dev:
	@echo "*** To stop this stack, run 'make stop-dev' ***"
	@echo "*** IMPORTANT This will now use ../data-hub-api/.env for 'api' and 'rq'services ***"
	$(MAKE) -C ../data-hub-api start-dev
	$(docker-dev) $(start-command)

stop-e2e:
	$(docker-e2e) down -v --remove-orphans
stop-dev:
	$(MAKE) -C ../data-hub-api stop-dev
	$(docker-dev) down -v --remove-orphans
