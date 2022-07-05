FROM alpine

RUN apk upgrade && apk update \
&& apk add npm \
&& npm install -g @nestjs/cli \
&& apk add git

COPY . pong-game

# installing project node modules
RUN cd pong-game; npm install

# debugging tools
RUN apk add vim

#EXPOSE 3000

COPY run.sh .
RUN chmod +x run.sh
CMD ["sh", "run.sh"]
