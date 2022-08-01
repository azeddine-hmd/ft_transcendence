CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 8080

all: run

build:
	@npm install .

run: build
	# @docker-compose up -d
	@npm run start:dev

clean: 
	rm -rf dist/ node_modules/ package-lock.json
	docker-compose down

.PHONY: all build run delete
