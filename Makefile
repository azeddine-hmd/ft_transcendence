all: run

build:
	docker-compose build

run: 
	docker-compose up

run_with_build: build run

down:
	docker-compose down

clean:
	rm -rf backend/node_modules frontend/node_modules
	rm -rf backend/dist frontend/dist
	rm -rf frontend/.next
	rm -rf backend/package-lock.json frontend/package-lock.json

restart: down run

reset: down
	docker volume rm $(shell docker volume ls -q)

back:
	docker exec -it backend bash

front:
	docker exec -it frontend bash

db:
	docker exec -it database bash

.PHONY: build run down restart reset back front db run_with_build clean
