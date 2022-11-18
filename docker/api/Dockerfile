FROM public.ecr.aws/lambda/nodejs:16 as build

ARG dir

COPY pnpm-workspace.yaml .npmrc package.json turbo.json ./

COPY ${dir} ./function/

COPY ./packages ./packages

RUN npm install -g pnpm

RUN pnpm install --no-frozen-lockfile

RUN pnpm build

FROM public.ecr.aws/lambda/nodejs:16

COPY --from=build ./var/task/function/dist ./function/dist

CMD [ "./function/dist/index.handler" ]