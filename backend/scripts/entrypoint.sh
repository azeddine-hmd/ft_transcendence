#!/bin/bash

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	npm run start
else
	npm run start:dev
fi

