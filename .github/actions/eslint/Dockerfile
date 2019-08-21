FROM node:12-slim

LABEL com.github.actions.name="ESLint"
LABEL com.github.actions.description="Lint your Javascript projects with inline lint error annotations."
LABEL com.github.actions.icon="code"
LABEL com.github.actions.color="yellow"

COPY src /actions/eslint/src
ENTRYPOINT ["/actions/eslint/src/entrypoint.sh"]
