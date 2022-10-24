import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

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
		private readonly gameService: GameService,
	) { }

	async handleConnection(socket: Socket, ...args: any[]) {
		console.log("CONNECTED AT GAME SERVER");
	}
	
	async handleDisconnect(socket: Socket, ...args: any[]) {
		console.log("DISCONNECTED AT GAME SERVER");
	}
	@SubscribeMessage('	')
	async messageMessage(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		let gameMode = 0;
		let isSearching = true
		this.server.emit('gameStart', socket.handshake.query.username, gameMode);
	}

	@SubscribeMessage('ball')
	async ball(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('ball', _data);
	}

	@SubscribeMessage('versus')
	async versus(@ConnectedSocket() socket: Socket, @MessageBody() body: string) 
	{
		const b = body.split(':');
		this.server.emit('inviteToPlay', b[0], b[1]);
	}

	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		console.log("GET PLAYER AT GAME SERVER")

		this.server.emit('getPlayer', _data);	
	}
}