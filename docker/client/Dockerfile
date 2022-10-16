FROM node:18 as build

RUN npm add -g pnpm

COPY pnpm-workspace.yaml .npmrc package.json turbo.json ./app/
COPY ./client ./app/client
COPY ./packages/common ./app/packages/common

WORKDIR /app

RUN pnpm install -r

RUN pnpm run build

EXPOSE 80

CMD [ "pnpm", "-F", "client", "start" ]
