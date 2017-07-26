#!/bin/bash
set -e

# For revert branches, do nothing
if [[ "$TRAVIS_BRANCH" == revert-* ]]; then
  echo -e "\e[36m\e[1mTest triggered for reversion branch \"${TRAVIS_BRANCH}\" - doing nothing."
  exit 0
fi

# For PRs
if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo -e "\e[36m\e[1mTest triggered for PR #${TRAVIS_PULL_REQUEST}."
fi

# Figure out the source of the test
if [ -n "$TRAVIS_TAG" ]; then
  echo -e "\e[36m\e[1mTest triggered for tag \"${TRAVIS_TAG}\"."
else
  echo -e "\e[36m\e[1mTest triggered for branch \"${TRAVIS_BRANCH}\"."
fi

# Run the tests
npm test
