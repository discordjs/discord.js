FROM node:18-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk update
RUN apk add --no-cache libc6-compat

RUN corepack enable
RUN corepack prepare pnpm@latest --activate

COPY . /usr/proxy-container
WORKDIR /usr/proxy-container

FROM base AS builder

RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm exec turbo run build --filter='@discordjs/proxy-container...'

FROM builder AS pruned

RUN pnpm --filter='@discordjs/proxy-container' --prod deploy pruned

FROM node:18-alpine AS proxy

WORKDIR /usr/proxy-container

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 proxy-container
USER proxy-container

COPY --from=pruned /usr/proxy-container/pruned .

CMD ["node", "--enable-source-maps", "dist/index.js"]
