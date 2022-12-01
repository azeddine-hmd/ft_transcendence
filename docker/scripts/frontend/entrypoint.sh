#!/bin/bash

npm install .
npm install next react react-dom --save
npm install --save @headlessui/react @heroicons/react

if [ "$MODE" == "dev" ]; then
	echo "mode [dev]..."
	npm run dev
else
	echo "mode [prod]..."
	npm run build
	npm run start
fi

