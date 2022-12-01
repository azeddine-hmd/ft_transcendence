import { UseFilters } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { handleWsException, WsExceptionFilter } from 'src/filter/ws-filter';
import { UsersSocketService } from 'src/users/services/users-socket.service';
import { PlayerInfo } from './game-queue';
import GameService from './game.service';

/*-------------------------------------------------------*/
const canvas_height = 600
const canvas_width = 600
var sBall = 4
const playerHeight = 75
const playerWith = 10
const ballHeight = 10
const final_score = 5
let _game: any =
	[
		[
			/*
			GAME 0 x: 200, y: 200		(200, 201)
			{
				left: {
					username: '',
					sockets: id,
					score: 0,
				},
				right: {
					username: '',
					sockets: id,
					score: 0,
				},
				finished: false,
				spectators: [
					10, 12, 13, 14, 
				]
				ball: {
					speed: {
						x: ,
						y: ,
					},
					x: ,
					y: ,
				},
				counter
			},
			*/
  ],

  [
    /*
			GAME 1 x: 10, y: 10
			{
				left: {
					username: '',
					sockets: id,
					score: 0,
				},
				right: {
					username: '',
					sockets: id,
					score: 0,
				},
				spectators: [
					10, 12, 13, 14, 
				],
				ball: {
					speed: {
						x: ,
						y: ,
					},
					x: ,
					y: ,
				}
			},
			*/
  ],
];
var sp: number;
let waiting: boolean = true;
/*-------------------------------------------------------*/

let ind: any;
function ballMove(m: any, i: any) {
  var d: number;
  var e: number;
  d = Number(_game[m][i].right.y) + Number(playerHeight);
  e = Number(_game[m][i].left.y) + Number(playerHeight);
  if (_game[m][i].ball.y > canvas_height || _game[m][i].ball.y < 0)
    _game[m][i].ball.speed.y *= -1;
  if (_game[m][i].ball.x > canvas_width - playerWith) {
    if (_game[m][i].ball.y < _game[m][i].right.y || _game[m][i].ball.y > d) {
      _game[m][i].ball.x = canvas_width / 2;
      _game[m][i].ball.y = canvas_height / 2;
      _game[m][i].ball.speed.y = sBall;
      _game[m][i].ball.speed.x = sBall;
      _game[m][i].right.score++;
    } else {
      var a: number = Number(playerHeight / 2);
      var b: number = Number(_game[m][i].right.y) + a;
      var c: number = Number(_game[m][i].ball.y) - b;
      var collidePoint: number = c;
      collidePoint = collidePoint / a;
      let angleRad: number = (Math.PI / 4) * collidePoint;
      let direction: number =
        _game[m][i].ball.x + _game[m][i].ball.r < canvas_width / 2 ? 1 : -1;
      _game[m][i].ball.speed.x = direction * sBall * Math.cos(angleRad);
      _game[m][i].ball.speed.y = sBall * Math.sin(angleRad);
      // sBall += 0.1;
    }
  } else if (_game[m][i].ball.x < playerWith) {
    if (_game[m][i].ball.y < _game[m][i].left.y || _game[m][i].ball.y > e) {
      _game[m][i].ball.x = canvas_width / 2 - ballHeight / 2;
      _game[m][i].ball.y = canvas_height / 2 - ballHeight / 2;
      _game[m][i].ball.speed.x = sBall * -1;
      _game[m][i].ball.speed.y = sBall;
      _game[m][i].left.score++;
    } else {
      let collidePoint: number =
        _game[m][i].ball.y - (_game[m][i].left.y + playerHeight / 2);
      collidePoint = collidePoint / (playerHeight / 2);
      let angleRad: number = (Math.PI / 4) * collidePoint;
      let direction: number =
        _game[m][i].ball.x + _game[m][i].ballHeight / 2 < canvas_width / 2
          ? -1
          : 1;
      _game[m][i].ball.speed.x = direction * sBall * Math.cos(angleRad);
      _game[m][i].ball.speed.y = sBall * Math.sin(angleRad);
      // sBall += 0.1;
    }
  }
}

@UseFilters(WsExceptionFilter)
@WSAuthGuard
@WebSocketGateway({
  namespace: 'game',
  cors: [process.env.FRONTEND_HOST, process.env.BACKEND_HOST],
  cookie: true,
})
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly usersSocketService: UsersSocketService,
  ) {}

  final(m: any, i: any) {
    var winner: any;
    var winnerScore: any;
    var loser: any;
    var loserScore: any;

    if (_game[m][i].right.score > _game[m][i].left.score) {
      winner = _game[m][i].right.username;
      winnerScore = _game[m][i].right.score;

      loser = _game[m][i].left.username;
      loserScore = _game[m][i].left.score;
    } else {
      winner = _game[m][i].left.username;
      winnerScore = _game[m][i].left.score;

      loser = _game[m][i].right.username;
      loserScore = _game[m][i].right.score;
    }
    this.gameService.createGameMatch({
      winner: winner,
      loser: loser,
      winnerScore: winnerScore,
      loserScore: loserScore,
      mode: m === 1 ? 'Hard' : 'Easy',
    });
  }

  ft = (m: any, i: any) => {
    ballMove(m, i);
    this.server
      .to([
        ..._game[m][i].left.sockets,
        ..._game[m][i].right.sockets,
        ..._game[m][i].spectators,
      ])
      .emit(
        'ballPos',
        _game[m][i].left.username +
          ' ' +
          _game[m][i].right.username +
          ' ' +
          _game[m][i].ball.x +
          ' ' +
          _game[m][i].ball.y +
          ' ' +
          _game[m][i].left.score +
          ' ' +
          _game[m][i].right.score +
          ' ' +
          _game[m][i].left.y +
          ' ' +
          _game[m][i].right.y,
      );
    if (m === 0) sp = 1;
    else sp = 2;
    _game[m][i].ball.x += _game[m][i].ball.speed.x * sp;
    _game[m][i].ball.y += _game[m][i].ball.speed.y * sp;

    if (
      Number(_game[m][i].right.score) >= final_score ||
      Number(_game[m][i].left.score) >= final_score
    ) {
      this.server
        .to([
          ..._game[m][i].left.sockets,
          ..._game[m][i].right.sockets,
          ..._game[m][i].spectators,
        ])
        .emit('endGame');
      this.final(m, i);
      _game[m][i].finished = true;
      clearInterval(_game[m][i].counter);
      return;
    }
  };
  startGame(m: any, i: any) {
    _game[m][i].counter = setInterval(this.ft, 1000 * 0.02, m, i);
  }

  @SubscribeMessage('checkInvite')
  checkInvite(@ConnectedSocket() client: Socket) {
    if (
      client.user.username == this.gameService.playr ||
      client.user.username == this.gameService.playr2
    ) {
      if (client.user.username == this.gameService.playr)
        this.gameService.playr = null;
      else this.gameService.playr2 = null;
      const queue1 = this.gameService.matchesChat[0];
      if (client.user.username) {
        let ind = queue1.findIndex(function (obj: any) {
          return obj.username === client.user.username;
        }); // -1, >= 0
        // not found
        if (ind === -1)
          queue1.push({ sockets: [client.id], username: client.user.username });
        // found
        else queue1[ind].sockets.push(client.id);
        // queue1.push({ sockets: [client.id], username: client.user.username });
      }

      if (queue1.length >= 2) {
        var i: number = 0;
        let contender = queue1[0].username;
        let ind =
          _game[i].push({
            left: {
              ...queue1.splice(0, 1)[0], // sockets: [], username: '',
              score: 0,
              y: canvas_height / 2 - playerHeight / 2,
            },
            finished: false,
            spectators: [],
            ball: {
              speed: {
                x: sBall,
                y: sBall,
              },
              x: canvas_width / 2,
              y: canvas_height / 2,
            },
            counter: 0,
          }) - 1;

        var index = queue1.findIndex(function (obj: any) {
          return obj.username === client.user.username;
        });

        if (index != -1)
          _game[i][ind].right = {
            ...queue1.splice(index, 1)[0],
            score: 0,
            y: canvas_height / 2 - playerHeight / 2,
          };
        this.server
          .to([..._game[i][ind].left.sockets, ..._game[i][ind].right.sockets])
          .emit('abcd', client.user.username, contender, i, ind);
        console.log('ind = ', ind);
        console.log('i = ', i);
        this.startGame(i, ind);
      }
    }
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      await this.usersSocketService.authenticate(client);
      await this.usersSocketService.setStates(client.user.userId, 'in game');
    } catch (exception) {
      handleWsException(client, exception);
    }
  }

  async handleDisconnect(client: Socket, ...args: any[]) {
    if (client.user) {
      try {
        await this.usersSocketService.setStates(client.user.userId, 'in game');
      } catch (exception) {
        console.log(exception);
      }

      client.emit('ok', client.user.username);
      if (!client.user.username) return;

      if (client.handshake.query.mode) {
        let usern = client.user.username;
        let mode = client.handshake.query.mode;
        let i: any = mode === 'Easy' ? 0 : 1;
        const queue = this.gameService.matches[i];
        ind = queue.findIndex(
          (player: PlayerInfo) => player.username === usern,
        ); // -1, >= 0
        if (ind !== -1) {
          if (queue[ind].sockets.indexOf(client.id) !== -1) {
            queue[ind].sockets.splice(queue[ind].sockets.indexOf(client.id));
          }
        }
      }

      const usrname = client.user.username;
      let index: any;

      index = _game[0].findIndex((gm: any, key: any) => {
        return (
          gm.finished === false &&
          (gm.left.username === usrname || gm.right.username === usrname)
        );
      });

      if (index !== -1) {
        if (usrname === _game[0][index].left.username) {
          _game[0][index].right.score = final_score;
          _game[0][index].left.score = 0;
        } else {
          _game[0][index].left.score = final_score;
          _game[0][index].right.score = 0;
        }
        return;
      }

			const usrname = client.user.username;
			let index: any
			index = _game[0].findIndex((gm: any, key: any) => {
				return (gm.finished === false &&
					(gm.left.username === usrname ||
						gm.right.username === usrname))
			})

  @SubscribeMessage('leaveGame')
  gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
    const arr = _data.split(' ');

    let mode = arr[1] === 'Easy' ? 0 : 1;
    let index = Number(arr[2]);
    var playerName = arr[0];

    if (!_game || !_game[mode] || !_game[mode][index]) return;

    if (playerName === _game[mode][index].left.username) {
      _game[mode][index].right.score = final_score;
      _game[mode][index].left.score = 0;
    } else {
      _game[mode][index].left.score = final_score;
      _game[mode][index].right.score = 0;
    }
  }

  @SubscribeMessage('getPlayer')
  getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
    const arr = _data.split(' ');
    var mode = Number(arr[0]);
    var indx = Number(arr[1]);

    if (!_game || !_game[mode] || !_game[mode][indx]) return;

    if (_game[mode][indx].left.username === arr[2]) {
      _game[mode][indx].left.y = Number(arr[3]);
    } else if (arr[2] === _game[mode][indx].right.username) {
      _game[mode][indx].right.y = Number(arr[3]);
    }
  }

  @SubscribeMessage('live')
  live(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
    let not_finished_easy = _game[0].map((gm: any) => {
      if (gm.finished === false)
        return { left: gm.left, right: gm.right, ball: gm.ball };
    });
    let not_finished_hard = _game[1].map((gm: any) => {
      if (gm.finished === false)
        return { left: gm.left, right: gm.right, ball: gm.ball };
    });
    this.server
      .to(client.id)
      .emit('liveGames', { easy: not_finished_easy, hard: not_finished_hard });
  }

  @SubscribeMessage('joingame')
  joingame(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
    const arr = _data.split(' ');
    let mode = arr[0] === 'Easy' ? 0 : 1;
    let indx = Number(arr[1]);
    _game[mode][indx].spectators.push(client.id);
    this.server
      .to(client.id)
      .emit(
        'abcd',
        _game[mode][indx].left.username,
        _game[mode][indx].right.username,
        mode,
        indx,
      );
  }

  @SubscribeMessage('stopLive')
  stopLive(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
    const arr = _data.split(' ');
    let mode = arr[0] === 'Easy' ? 0 : 1;
    let indx = Number(arr[1]);
    const clientIdIndx = _game[mode][indx].spectators.indexOf(client.id);
    _game[mode][indx].spectators.splice(clientIdIndx, 1);
  }

  @SubscribeMessage('quit')
  quit(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
    const arr = _data.split(' ');
    let mode = arr[0] === 'Easy' ? 0 : 1;
    let indx = Number(arr[1]);
    clearInterval(_game[mode][indx].counter);
  }
}
