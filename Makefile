CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 8080

all: run

build:
	@npm install .

run: build
	@clear
	@npm run start

clean: 
	@rm -rf dist/ node_modules/ package-lock.json

.PHONY: all build run delete
