import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
@WebSocketGateway({ 
	namespace: 'game',
	cors: {origin: '*'},
})
export class GameGateway {
	@WebSocketServer()
	server: Server;

	constructor(
        private readonly gameService: GameService,
    ) {}
   
	handleConnection(client: Socket, ...args: any[]) {
	}
	
	handleDisconnect(client: Socket, ...args: any[]) {
	
		if (!client.handshake.query.username || !client.handshake.query.mode)
			return
		let usern = client.handshake.query.username
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
		if (client.handshake.query.username)
		{
			if(waiting) 
			{
				let ind = queue.findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } ) // -1, >= 0
				// not found
				if ( ind === -1 ) 
					queue.push({ sockets: [client.id], username: client.handshake.query.username as string});
				// found
				else 
					queue[ind].sockets.push(client.id)
			}
			else
			{
				const index = queue.findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } )
				if (index > -1) 
				{
					queue.splice(index, 1);
				}
			}
			if (queue.length >= 2)
			{				
				let contender = queue[0].username;
				let ind = _game[i].push( { left: queue.splice(0, 1)[0] } ) - 1;

				var index = queue.findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } );
				if (index != -1) 
					_game[i][ind].right = queue.splice(index, 1)[0];
				this.server.to([..._game[i][ind].left.sockets, ..._game[i][ind].right.sockets]).emit('abcd',client.handshake.query.username , contender, i,  ind);
			}
		}
	}

	@SubscribeMessage('getResult')
	gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		const arr = _data.split(' ');
		console.log(arr);
		
		this.gameService.createGameMatch({
			winner: arr[0],
			loser: arr[1],
			winnerScore: Number(arr[2]),
			loserScore: Number(arr[3]),
			mode: String(arr[4]),
		});
	}

	@SubscribeMessage('ballPos')
	ball(@ConnectedSocket() client: Socket, @MessageBody() _data: string) 
	{
		let arr:any = _data.split(" ");
		let i = arr[7] === 'Easy' ? 0 : 1
		this.server.to([..._game[i][arr[6]].left.sockets, ..._game[i][arr[6]].right.sockets]).emit('ballPos', _data);
	}

	@SubscribeMessage('getPlayer')
	getPlayer(@ConnectedSocket() client: Socket, @MessageBody() _data: string)
	{
		this.server.emit('getPlayer', _data);	
	}

	@SubscribeMessage('test')
	test(@ConnectedSocket() socket: Socket, @MessageBody() body: string) 
	{
		const b = body.split(':');
		this.server.emit('live', body);
	}
}