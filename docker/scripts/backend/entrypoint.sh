#!/bin/bash

npm install -g npm@latest
npm install -g @nestjs/cli
npm install .
npm run build
npm run start:$MODE
