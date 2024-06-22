FROM node:20-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

CMD npm start
