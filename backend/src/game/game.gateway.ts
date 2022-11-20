import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { table } from 'console';
import { Server, Socket } from 'socket.io';
// import { UserService } from './game.service';

let match:any = [
	// easy : 0
	[
		/*
		{
			username: abel-haj,cket
			sockets: [
				1,
				2,
				3,
			],
		},

		{
			username: murachi,
			sockets: [
				10,
				11,
				12,
				342,
			]
		},

		{
			username: fbouibao,
			sockets: [
				20,
			]
		},

		murachid
		*/
	],
	// hard : 1
	[],
];
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
@WebSocketGateway(
{ 
	namespace: 'game',
	cors: {origin: '*'},
}
)
  
export class GameGateway {
	@WebSocketServer()
	server: Server;

	// constructor(
    //         private readonly user: UserService
    // ) { }
   
	handleConnection(client: Socket, ...args: any[]) {
	}
	
	handleDisconnect(client: Socket, ...args: any[]) {
		if (!client.handshake.query.username || !client.handshake.query.mode)
			return
		let usern = client.handshake.query.username
		let mode = client.handshake.query.mode;
		let i:any = mode === 'Easy' ? 0 : 1

		let ind = match[i].findIndex(function (obj:any) { return (obj.username === usern) } ) // -1, >= 0

		if ( ind !== -1 ) {
			if (match[i][ind].sockets.indexOf(client.id) !== -1)
				match[i][ind].sockets.splice(match[i][ind].sockets.indexOf(client.id))
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
		waiting = true;
		if(data.toString().includes("cancel"))
			waiting = false;
		if (client.handshake.query.username)
		{
			if(waiting) 
			{
				let ind = match[i].findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } ) // -1, >= 0
				// not found
				if ( ind === -1 ) 
					match[i].push({ sockets: [client.id], username: client.handshake.query.username});
				// found
				else 
					match[i][ind].sockets.push(client.id)
			}
			else
			{
				const index = match[i].findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } )
				if (index > -1) 
				{
					match[i].splice(index, 1);
				}
			}
			if (match[i].length >= 2)
			{				
				let contender = match[i][0].username;
				let ind = _game[i].push( { left: match[i].splice(0, 1)[0] } ) - 1;

				var index = match[i].findIndex(function (obj:any) { return (obj.username === client.handshake.query.username) } );
				if (index != -1) 
					_game[i][ind].right = match[i].splice(index, 1)[0];
				this.server.to([..._game[i][ind].left.sockets, ..._game[i][ind].right.sockets]).emit('abcd',client.handshake.query.username , contender, i,  ind);
			
			}
			if (_game[i] && _game[i].left)
				table(_game[i].left)
			if (_game[i] && _game[i].right)
				table(_game[i].right)
		}
	}

	@SubscribeMessage('getResult')
	gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		const arr = _data.split(' ');
		// console.log("arr[0] = " + arr[0]);
		// console.log("arr[1] = " + arr[1]);
	}

	@SubscribeMessage('ballPos')
	ball(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
		let arr:any = _data.split(" ");
		let i = arr[7] === 'Easy' ? 0 : 1
		this.server.to([..._game[i][arr[6]].left.sockets, ..._game[i][arr[6]].right.sockets]).emit('ballPos', _data);
		
	}

	@SubscribeMessage('getPlayer')
	getPlayer(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
		this.server.emit('getPlayer', _data);	
	} 

	@SubscribeMessage('fofo')
	fofo(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
		this.server.emit('fofo', _data);	
	} 
}