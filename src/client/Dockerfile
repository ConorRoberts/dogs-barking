FROM node:16-alpine

WORKDIR /usr/app

COPY . .

RUN npm i -g pnpm
RUN pnpm install

RUN pnpm build

CMD ["pnpm", "start"]