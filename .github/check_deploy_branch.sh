#!/bin/bash

git diff HEAD^ HEAD --quiet .

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" && $? -eq 1 ]]; then
	# Proceed with the build
	echo "✅ - Proceed"
	exit 1;
else
	# Don't build
	echo "🛑 - Build cancelled"
	exit 0;
fi
