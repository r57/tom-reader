FROM node:16-alpine as builder
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
RUN yarn build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --prod
CMD [ "node", "dist/index.js" ]