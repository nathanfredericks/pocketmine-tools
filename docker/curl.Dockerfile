FROM alpine/curl:8.9.0

RUN apk update
RUN apk add jq