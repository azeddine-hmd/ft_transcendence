FROM alpine

RUN apk upgrade && apk update \
&& apk add npm \
&& npm install -g @nestjs/cli
#&& npm install @nestjs/common \
#&& npm install @nestjs/core


COPY run.sh .
RUN chmod +x run.sh
COPY . pong-game

EXPOSE 3000

# debugging tools
RUN apk add vim

CMD ["sh", "run.sh"]
