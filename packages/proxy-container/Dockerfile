FROM node:18-alpine AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/proxy

COPY manifests .

RUN npm install --global is-ci husky

RUN yarn install --immutable --inline-builds
RUN rm -rf .yarn/cache

FROM node:18-alpine AS runner

WORKDIR /usr/proxy

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 proxy
USER proxy

COPY --from=builder /usr/proxy .
COPY packs .

CMD ["node", "--enable-source-maps", "dist/index.js"]
