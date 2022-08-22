all: run

run: 
	docker-compose up

down:
	@docker-compose down

restart: down run

reset: down
	@docker volume rm $(shell docker volume ls -q)

.PHONY: run down restart reset
