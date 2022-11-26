import { Logger, UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WSAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { handleWsException, WsExceptionFilter } from 'src/filter/ws-filter';
import { UsersSocketService } from 'src/users/services/users-socket.service';
import { PlayerInfo } from './game-queue';
import GameService from './game.service';

let _game:any = 
[
	[
		/*
		GAME 0 x: 200, y: 200		(200, 201)
		{
			left: {
				username: '',
				sockets: id,
			},
			right: {
				username: '',
				sockets: id,
				// score
			},
			finished: false,
			spectators: [
				10, 12, 13, 14, 
			]
		},
		to(_game[mode][]).emit('', {data})


		GAME 1 x: 10, y: 10
		{
			left: {
				username: '',
				sockets: id,
			},
			right: {
				username: '',
				sockets: id,
			},
			spectators: [
				10, 12, 13, 14, 
			]
		},
		*/
	],

	[
	]
];

let waiting:boolean = true;

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
    ){}
   
	async handleConnection(client: Socket, ...args: any[]) 
	{
		try {
			await this.usersSocketService.authenticate(client);
			console.log(`client connected on game gateway id=${client.id} "   "${client.user.username}`);
		  } catch (exception) {
			handleWsException(client, exception);
		}
	}
	
	handleDisconnect(client: Socket, ...args: any[]) 
	{ 

		if (client.user) {
			console.log(`client disconnected on game gateway id=${client.id}`);
			if (!client.user.username || !client.handshake.query.mode)
				return
			let usern = client.user.username
			let mode = client.handshake.query.mode;
			let i:any = mode === 'Easy' ? 0 : 1
			const queue = this.gameService.matches[i];
			let ind = queue.findIndex((player: PlayerInfo) => { 
				return (player.username === usern) 
			}) // -1, >= 0
			if ( ind !== -1 ) {
				if (queue[ind].sockets.indexOf(client.id) !== -1) {
					queue[ind].sockets.splice(queue[ind].sockets.indexOf(client.id));
				}
			}
		}
	}

	@SubscribeMessage('match')
	messageMessage(@ConnectedSocket()  client: Socket,  @MessageBody() data: string)
	{
		var i:number = 0;
		if (data.includes("Easy"))
			i = 0;
		if (data.includes("Hard"))
			i = 1;
		const queue = this.gameService.matches[i];
		waiting = true;
		if(data.toString().includes("cancel"))
			waiting = false;
		if (client.user.username)
		{
			if(waiting) 
			{
				let ind = queue.findIndex(function (obj:any) { return (obj.username === client.user.username) } ) // -1, >= 0
				// not found
				if ( ind === -1 )
					queue.push({ sockets: [client.id], username: client.user.username as string});
				// found
				else 
					queue[ind].sockets.push(client.id)
			}
			else
			{
				const index = queue.findIndex(function (obj:any) { return (obj.username === client.user.username) } )
				if (index > -1) 
				{
					queue.splice(index, 1);
				}
			}
			if (queue.length >= 2)
			{				
				let contender = queue[0].username;
				let ind = _game[i].push( { left: queue.splice(0, 1)[0], finished: false, spectators: [] } ) - 1;
				var index = queue.findIndex(function (obj:any) { return (obj.username === client.user.username) } );
				
				if (index != -1)
					_game[i][ind].right = queue.splice(index, 1)[0];
				this.server.to([..._game[i][ind].left.sockets, ..._game[i][ind].right.sockets]).emit('abcd',client.user.username , contender, i,  ind);
			}
		}
	}

	@SubscribeMessage('getResult')
	gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		const arr = _data.split(' ');
		this.gameService.createGameMatch({
			winner: arr[0],
			loser: arr[1],
			winnerScore: Number(arr[2]),
			loserScore: Number(arr[3]),
			mode: String(arr[4]),
		});
		let mode = (arr[4] === 'Easy') ? 0 : 1;
		_game[mode][Number(arr[5])].finished = true;
	}

	@SubscribeMessage('ballPos')
	ball(@ConnectedSocket() client: Socket, @MessageBody() _data: string) 
	{
		let arr:any = _data.split(" ");
		let i = Number();
		if(arr[6] === 'Easy') 
			i = 0;
		else
			i = 1;
		this.server.to([
			..._game[i][Number(arr[7])].left.sockets,
			..._game[i][Number(arr[7])].right.sockets,
			..._game[i][Number(arr[7])].spectators]).emit('ballPos', _data);
			
	}
	@SubscribeMessage('live')
	live(@ConnectedSocket() client: Socket, @MessageBody() _data: string)
	{
		let not_finished_easy = _game[0].map((element:any) => { if (element.finished === false) return element })
		let not_finished_hard = _game[1].map((element:any) => { if (element.finished === false) return element })
		this.server.to(client.id).emit('live', { easy: not_finished_easy, hard: not_finished_hard });
	}

	// @SubscribeMessage('test')
	// test(@ConnectedSocket() client: Socket, @MessageBody() _data: string)
	// {
	// 	// console.log('GAMES EASY', _game[0]);
	// 	// console.lo≈g('GAMES HARD', _game[1]);
	// }

	@SubscribeMessage('clear')
	clear(@ConnectedSocket() client: Socket, @MessageBody() _data: string)
	{
		_game[0] = []
		_game[1] = []
	}
	@SubscribeMessage('joingame')
	joingame(@ConnectedSocket() client: Socket, @MessageBody() _data: string)
	{
		const arr = _data.split(' ');
		let mode = arr[0] === 'Easy' ? 0 : 1
		let indx = Number(arr[1]);
		_game[mode][indx].spectators.push(client.id);
		this.server.to(client.id).emit('abcd', _game[mode][indx].left.username, _game[mode][indx].right.username, mode, indx)
	}
}