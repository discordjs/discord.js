#!/bin/sh

set -e

if [ -e node_modules/.bin/eslint ]; then
	setup=""
else
	setup="NODE_ENV=development npm install &&"
fi

echo "## Installing modules & running ESLint"
sh -c "$setup NODE_PATH=node_modules node /actions/eslint/src/index.js"
