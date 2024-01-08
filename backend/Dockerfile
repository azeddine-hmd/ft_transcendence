FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

COPY ./package*.json ./
RUN if [ "$NODE_ENV" = "production" ]; then \
	npm ci --omit=dev; \
else \
	npm ci; \
fi

COPY . ./

RUN chmod +x ./scripts/entrypoint.sh
CMD ["./scripts/entrypoint.sh"]
