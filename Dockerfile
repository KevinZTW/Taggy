FROM node:12.18-alpine3.9

RUN mkdir /app
WORKDIR client/app

COPY package.json package.json
COPY client/app/package.json app/package.json
RUN npm install --silent 
RUN cd app && npm install --silent

COPY . .

LABEL maintainer="Kevin Zhang <kevin.zhang.tw@gmail.com>"

CMD ./scripts/start.sh
