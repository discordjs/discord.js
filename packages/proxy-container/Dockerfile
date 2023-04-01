FROM node:16-alpine as builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/proxy

COPY manifests .

RUN yarn install --immutable
RUN rm -rf .yarn/cache

FROM node:16-alpine AS runner

WORKDIR /usr/proxy

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 proxy
USER proxy

COPY --from=installer /usr/proxy .
COPY packs .

CMD ["node", "--enable-source-maps", "dist/index.js"]
