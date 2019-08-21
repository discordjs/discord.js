#!/bin/sh

set -e

if [ -e node_modules/.bin/eslint ]; then
	setup=""
else
	if [ -f yarn.lock ]; then
		setup="yarn --production=false &&"
	else
		setup="NODE_ENV=development npm install &&"
	fi
fi

echo "## Installing modules & running ESLint"
sh -c "$setup NODE_PATH=node_modules node /action/eslint/src/index.js"
