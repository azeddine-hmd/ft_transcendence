#!/bin/bash

npm install -g npm@latest
npm install .
npm install --save @headlessui/react @heroicons/react

if [ "$MODE" == "dev" ]; then
	echo "mode [dev]..."
	npm run dev
else
	echo "mode [prod]..."
	npm run build
	npm run start
fi
