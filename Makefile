CONTAINER_NAME = pong-game
IMAGE = pong-image

all: build

build:
	docker build -t $(IMAGE) .
	
run: build
	docker run --name=$(CONTAINER_NAME) $(IMAGE)

stop:
	docker container stop $(CONTAINER_NAME)

restart: stop run

shell:
	docker exec -it $(CONTAINER_NAME) sh

.PHONY: build run clean
