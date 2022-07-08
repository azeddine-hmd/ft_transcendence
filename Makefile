CONTAINER_NAME = pong-game

IMAGE = pong-image

PORT = 8080

all: run

build:
	npm install

run: build
	npm run start:dev

delete: 
	npm uninstall --no-save .
