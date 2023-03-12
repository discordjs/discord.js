FROM node:16-alpine as builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/proxy

COPY . .
RUN yarn dlx turbo prune --scope=@discordjs/proxy-container --docker

FROM node:16-alpine AS installer

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/proxy

COPY .gitignore .gitignore
COPY .yarn/ .yarn/
COPY .yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/proxy/out/json/ .
COPY --from=builder /usr/proxy/out/yarn.lock ./yarn.lock
RUN yarn install

COPY --from=builder /usr/proxy/out/full/ .
COPY tsup.config.ts tsup.config.ts
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json
RUN yarn dlx turbo run build --filter=@discordjs/proxy-container...

RUN yarn workspaces focus @discordjs/proxy-container --production

FROM node:16-alpine AS runner

WORKDIR /usr/proxy

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 proxy
USER proxy

COPY --from=installer /usr/proxy .

CMD ["node", "--enable-source-maps", "packages/proxy-container/dist/index.js"]
