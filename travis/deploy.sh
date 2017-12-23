#!/bin/bash
# Adapted from https://gist.github.com/domenic/ec8b0fc8ab45f39403dd.
set -e

# For revert branches, do nothing
if [[ "$TRAVIS_BRANCH" == revert-* ]]; then
  echo -e "\e[36m\e[1mBuild triggered for reversion branch \"${TRAVIS_BRANCH}\" - doing nothing."
  exit 0
fi

DONT_COMMIT=false

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo -e "\e[36m\e[1mBuild triggered for PR #${TRAVIS_PULL_REQUEST} to branch \"${TRAVIS_BRANCH}\" - not commiting"
  SOURCE_TYPE="pr"
  DONT_COMMIT=true
elif [ -n "$TRAVIS_TAG" ]; then
  echo -e "\e[36m\e[1mBuild triggered for tag \"${TRAVIS_TAG}\"."
  SOURCE=$TRAVIS_TAG
  SOURCE_TYPE="tag"
else
  echo -e "\e[36m\e[1mBuild triggered for branch \"${TRAVIS_BRANCH}\"."
  SOURCE=$TRAVIS_BRANCH
  SOURCE_TYPE="branch"
fi

# Run the build
npm run docs
VERSIONED=false npm run webpack

if [ $DONT_COMMIT == true ]; then
  echo -e "\e[36m\e[1mNot commiting - exiting early"
  exit 0
fi

# Initialise some useful variables
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Decrypt and add the ssh key
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in travis/deploy-key.enc -out deploy-key -d
chmod 600 deploy-key
eval `ssh-agent -s`
ssh-add deploy-key

# Checkout the repo in the target branch so we can build docs and push to it
TARGET_BRANCH="docs"
git clone $REPO out -b $TARGET_BRANCH

# Move the generated JSON file to the newly-checked-out repo, to be committed and pushed
mv docs/docs.json out/$SOURCE.json

# Commit and push
cd out
git add .
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
git commit -m "Docs build for ${SOURCE_TYPE} ${SOURCE}: ${SHA}" || true
git push $SSH_REPO $TARGET_BRANCH

# Clean up...
cd ..
rm -rf out

# ...then do the same once more for the webpack
TARGET_BRANCH="webpack"
git clone $REPO out -b $TARGET_BRANCH

# Move the generated webpack over
mv webpack/discord.js out/discord.$SOURCE.js
mv webpack/discord.min.js out/discord.$SOURCE.min.js

# Commit and push
cd out
git add .
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
git commit -m "Webpack build for ${SOURCE_TYPE} ${SOURCE}: ${SHA}" || true
git push $SSH_REPO $TARGET_BRANCH
