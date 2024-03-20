FROM node:20-alpine as builder

RUN apk add --no-cache libc6-compat git

WORKDIR /app
COPY . .
COPY package.json yarn.lock turbo.json tsconfig.json ./

RUN yarn workspace focus @chibisafe/next
RUN yarn workspace @chibisafe/next build

FROM node:20-alpine as runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/packages/next/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/packages/next/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/next/.next/static ./.next/static/

USER nextjs

EXPOSE 8001
ENV HOSTNAME 0.0.0.0
ENV PORT 8001

CMD ["node", "--dns-result-order=ipv4first", "server.js"]
