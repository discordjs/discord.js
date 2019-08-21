FROM node:12-slim

LABEL com.github.actions.name="ESLint"
LABEL com.github.actions.description="Lint your Javascript projects with inline lint error annotations."
LABEL com.github.actions.icon="code"
LABEL com.github.actions.color="yellow"

COPY src /action/eslint/src
ENTRYPOINT ["/action/eslint/src/entrypoint.sh"]
