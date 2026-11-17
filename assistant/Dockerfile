FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build && npm run assistant:knowledge

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787
COPY --from=build /app/assistant ./assistant
USER node
EXPOSE 8787
CMD ["node", "assistant/server.mjs"]
