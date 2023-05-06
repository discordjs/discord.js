FROM node:18-alpine AS builder

RUN apk update
RUN apk add --no-cache libc6-compat

WORKDIR /usr/redis-gateway

COPY manifests .

RUN npm install --global is-ci husky

RUN yarn install --immutable --inline-builds
RUN rm -rf .yarn/cache

FROM node:18-alpine AS runner

WORKDIR /usr/redis-gateway

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 redis-gateway
USER redis-gateway

COPY --from=builder /usr/redis-gateway .
COPY packs .

CMD ["node", "--enable-source-maps", "dist/index.js"]
