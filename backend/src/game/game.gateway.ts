import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// let pOne:any = [];
// let pTwo:any = [];
let match:any = [[],[]];
let contender:any;

@WebSocketGateway(
{ 
	namespace: 'game',
	cors: {origin: '*'},
}
)

export class GameGateway {
	@WebSocketServer()
	server: Server;

	constructor(
		) { }

	async handleConnection(socket: Socket, ...args: any[]) {
		console.log("CONNECTED AT GAME SERVER");
	}
	
	async handleDisconnect(socket: Socket, ...args: any[]) {
		console.log("DISCONNECTED AT GAME SERVER");
	}

	@SubscribeMessage('match')
	async messageMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: string) 
	{
		if (socket.handshake.query.username)
			match[0].push(socket.handshake.query.username);
		if (socket.handshake.query.username && match[0].length >= 2)
		{
			contender = match[0][1];
			this.server.emit('_start', socket.handshake.query.username, contender);
		}
	}

	@SubscribeMessage('ball')
	async ball(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('ball', _data);
	}

	@SubscribeMessage('versus')
	async versus(@ConnectedSocket() socket: Socket, @MessageBody() body: string) 
	{
		const b = body.split(':');
	}

	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		console.log("GET PLAYER AT GAME SERVER")
		this.server.emit('getPlayer', _data);	
	}
}