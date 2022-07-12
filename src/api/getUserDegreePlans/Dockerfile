FROM public.ecr.aws/lambda/nodejs:16

COPY . .

RUN npm install -g yarn
RUN yarn install
RUN yarn tsc
RUN yarn install --only=production

CMD [ "index.handler" ]