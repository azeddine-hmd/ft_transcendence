all: run

build:
	docker-compose build

run: 
	docker-compose up

run_with_build: build run

down:
	docker-compose down

clean: reset
	@echo "removing project's heavy dependencies..."
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist
	rm -rf frontend/.next
	rm -rf backend/package-lock.json frontend/package-lock.json

restart: down reset run

reset: down
	@echo "removing all docker volumes..."
	@docker volume rm $(shell docker volume ls -q) 2> /dev/null || true

back:
	docker exec -it backend bash

front:
	docker exec -it frontend bash

db:
	docker exec -it database bash

psql:
	@echo "entering postgres database prompt"
	@docker exec -it database 'bash' -c 'psql -U postgres -d transcendence'
