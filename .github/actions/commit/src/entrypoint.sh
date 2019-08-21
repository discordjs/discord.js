#!/bin/sh

set -e

# Initialise some useful variables
REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"

# Checkout the repo in the target branch so we can build docs and push to it
TARGET_BRANCH="docs"
git clone $REPO out -b $TARGET_BRANCH

# Move the generated JSON file to the newly-checked-out repo, to be committed and pushed
mv docs/docs.json out/$GITHUB_REF.json

# Commit and push
cd out
git add .
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git commit -m "Docs build for ${GITHUB_EVENT_NAME} ${GITHUB_REF}: ${GITHUB_SHA}" || true
git push origin $TARGET_BRANCH

# Clean up...
cd ..
rm -rf out

# ...then do the same once more for the webpack
TARGET_BRANCH="webpack"
git clone $REPO out -b $TARGET_BRANCH

# Move the generated webpack over
mv webpack/discord.min.js out/discord.$GITHUB_REF.min.js

# Commit and push
cd out
git add .
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git commit -m "Webpack build for ${GITHUB_EVENT_NAME} ${GITHUB_REF}: ${GITHUB_SHA}" || true
git push origin $TARGET_BRANCH
