CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 3000

all: run

build:
	docker build -t $(IMAGE) .

run: build
	docker run -d -p $(PORT):$(PORT) --name=$(CONTAINER_NAME) $(IMAGE)

stop:
	@docker container stop $(CONTAINER_NAME) 2> /dev/null || true

delete: stop
	@docker container rm $(CONTAINER_NAME) 2> /dev/null || true

restart: delete run

shell:
	docker exec -it $(CONTAINER_NAME) sh

update:
	docker cp . $(CONTAINER_NAME):pong-game

watch:
	docker container logs --follow $(CONTAINER_NAME)
