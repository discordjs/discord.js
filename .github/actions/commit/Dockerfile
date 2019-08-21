FROM node:12-slim

LABEL com.github.actions.name="Commit Docs"
LABEL com.github.actions.description="Commit docs to the docs/ branch."
LABEL com.github.actions.icon="upload-cloud"
LABEL com.github.actions.color="blue"

RUN apt-get update && apt-get install git

COPY src /actions/commit/src
ENTRYPOINT ["/actions/commit/src/entrypoint.sh"]
