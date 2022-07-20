#!/bin/bash

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
	# Proceed with the build
	echo "✅ - Proceed"
	exit 1;
else
	# Don't build
	echo "🛑 - Build cancelled"
	exit 0;
fi
