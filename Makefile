CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 8080

all: run

build:
	npm install

run: build
	npm run start:dev

delete: 
	npm uninstall

restart: delete run

shell:
	docker exec -it $(CONTAINER_NAME) sh

update:
	docker exec --workdir="/pong-game" $(CONTAINER_NAME) npm install
	docker cp . $(CONTAINER_NAME):pong-game

watch:
	docker container logs --follow $(CONTAINER_NAME)
