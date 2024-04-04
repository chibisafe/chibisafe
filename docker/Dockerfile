FROM node:20-alpine as builder

RUN apk add --no-cache libc6-compat git

WORKDIR /app
COPY . .
COPY package.json yarn.lock turbo.json tsconfig.json ./

RUN yarn workspaces focus @chibisafe/next
RUN yarn workspace @chibisafe/next build

FROM node:20-alpine as runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/packages/next/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/packages/next/.next/standalone ./

RUN rm -rf packages

COPY --from=builder --chown=nextjs:nodejs /app/packages/next/.next/standalone/packages/next ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/next/.next/static ./.next/static/

USER nextjs

EXPOSE 8001
ENV HOSTNAME 0.0.0.0
ENV HOST 0.0.0.0
ENV BASE_API_URL http://chibisafe_server:8000
ENV PORT 8001

CMD ["node", "--dns-result-order=ipv4first", "server.js"]
