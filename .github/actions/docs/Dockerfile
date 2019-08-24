FROM node:12-slim

LABEL com.github.actions.name="Docs"
LABEL com.github.actions.description="Commit docs to the docs/ branch."
LABEL com.github.actions.icon="upload-cloud"
LABEL com.github.actions.color="blue"

RUN apt-get update && apt-get install -y git

COPY src /actions/docs/src
ENTRYPOINT ["/actions/docs/src/entrypoint.sh"]
