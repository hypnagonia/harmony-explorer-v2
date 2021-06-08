FROM FROM node:14.4-alpine

RUN apk add --no-cache openssl

WORKDIR /usr/src/app
COPY . .

RUN npx yarn install --frozen-lockfile
RUN npx yarn run build

CMD ["npx", "yarn", "start:prod"]
