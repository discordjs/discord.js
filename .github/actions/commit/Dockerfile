FROM alpine

LABEL com.github.actions.name="Commit Docs"
LABEL com.github.actions.description="Commit docs to the docs/ branch."
LABEL com.github.actions.icon="upload-cloud"
LABEL com.github.actions.color="blue"

RUN apk add --no-cache git openssh-client

COPY src /actions/commit/src
ENTRYPOINT ["/actions/commit/src/entrypoint.sh"]
