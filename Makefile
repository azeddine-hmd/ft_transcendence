all: run

build:
	docker-compose build

run: 
	docker-compose up

run-with-build: build run

down:
	docker-compose down

clean:
	@echo "removing project's heavy dependencies..."
	rm -rf backend/dist frontend/dist backend/package-lock.json
	rm -rf frontend/.next frontend/package-lock.json

restart: clean run

reset: down clean
	@echo "removing all docker volumes..."
	@docker volume rm $(shell docker volume ls -q) 2> /dev/null || true

exec-back:
	docker exec -it backend bash

exec-front:
	docker exec -it frontend bash

exec-db:
	docker exec -it database bash

psql:
	@echo "entering postgres database prompt"
	@docker exec -it database 'bash' -c 'psql -U postgres -d transcendence'
