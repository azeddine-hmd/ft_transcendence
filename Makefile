all: run

run: 
	@docker-compose up --build

clean: 
	rm -rf backend/dist backend/node_modules backend/package-lock.json
	# docker volumes prune
	docker-compose down

.PHONY: run clean
