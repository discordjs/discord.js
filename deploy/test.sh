#!/bin/bash

set -e

function tests {
  npm run lint
  npm run docs:test
  exit 0
}

# For revert branches, do nothing
if [[ "$TRAVIS_BRANCH" == revert-* ]]; then
  echo -e "\e[36m\e[1mTest triggered for reversion branch \"${TRAVIS_BRANCH}\" - doing nothing."
  exit 0
fi

# For PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo -e "\e[36m\e[1mTest triggered for PR #${TRAVIS_PULL_REQUEST} to branch \"${TRAVIS_BRANCH}\" - only running tests."
  tests
fi

# Figure out the source of the test
if [ -n "$TRAVIS_TAG" ]; then
  echo -e "\e[36m\e[1mTest triggered for tag \"${TRAVIS_TAG}\"."
else
  echo -e "\e[36m\e[1mTest triggered for branch \"${TRAVIS_BRANCH}\"."
fi

# For Node != 6
if [ "$TRAVIS_NODE_VERSION" != "6" ]; then
  echo -e "\e[36m\e[1mTest triggered with Node v${TRAVIS_NODE_VERSION} - only running tests."
  tests
fi
