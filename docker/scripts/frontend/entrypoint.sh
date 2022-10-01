#!/bin/bash

npm install .
npm install --save @progress/kendo-react-dropdowns @progress/kendo-react-treeview @progress/kendo-react-animation @progress/kendo-react-intl @progress/kendo-react-data-tools @progress/kendo-react-common @progress/kendo-data-query @progress/kendo-react-buttons @progress/kendo-react-dateinputs @progress/kendo-react-inputs @progress/kendo-drawing @progress/kendo-licensing @progress/kendo-theme-default

if [ "$MODE" == "dev" ]; then
	echo "mode [dev]..."
	npm run dev
else
	echo "mode [prod]..."
	npm run build
	npm run start
fi
