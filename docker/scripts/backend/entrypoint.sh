#!/bin/bash

npm install .
npm run build
npm run start:$MODE
