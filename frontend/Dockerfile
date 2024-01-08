FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY ./package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; then \
	npm ci --omit=dev; \
else \
	npm i; \
fi

COPY . ./

RUN chmod +x ./scripts/entrypoint.sh
CMD ["./scripts/entrypoint.sh"]

