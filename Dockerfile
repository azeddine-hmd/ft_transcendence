FROM alpine

RUN apk upgrade && apk update \
&& apk add npm \
&& npm install -g @nestjs/cli


COPY scripts/run.sh .
RUN chmod +x run.sh
COPY . pong-game

EXPOSE 3000

CMD ["sh", "run.sh"]
