FROM node:lts

WORKDIR /usr/src/perf-dashboard

COPY package.json .

RUN yarn install --pure-lockfile

COPY . .

RUN yarn build

EXPOSE 8888

CMD ["yarn", "start"]
