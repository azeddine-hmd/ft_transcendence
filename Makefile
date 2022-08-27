all: run

build:
	docker-compose build

run: 
	docker-compose up

down:
	docker-compose down

restart: down run

reset: down
	docker volume rm $(shell docker volume ls -q)

back:
	docker exec -it backend bash

front:
	docker exec -it frontend bash

db:
	docker exec -it database bash

.PHONY: build run down restart reset back front db
