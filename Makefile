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

.PHONY: build run down restart reset
