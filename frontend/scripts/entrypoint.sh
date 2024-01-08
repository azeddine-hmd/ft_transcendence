#!/bin/bash

npx update-browserslist-db@latest >/dev/null
npx next telemetry disable >/dev/null

if [ "$NODE_ENV" == "production" ]; then
	npm run build
	npm run start
else
	npm run dev
fi

