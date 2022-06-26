CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 3000

all: run

build:
	docker build -t $(IMAGE) .
	
run: delete
	docker run -d -p $(PORT):$(PORT) --name=$(CONTAINER_NAME) $(IMAGE)

stop:
	docker container stop $(CONTAINER_NAME)

delete: stop
	docker container rm $(CONTAINER_NAME)

restart: delete run

shell:
	docker exec -it $(CONTAINER_NAME) sh

update:
	docker cp pong-game $(CONTAINER_NAME):.

watch:
	docker container logs --follow $(CONTAINER_NAME)