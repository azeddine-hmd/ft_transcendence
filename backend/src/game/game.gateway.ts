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

	@SubscribeMessage('ball')
	async ballMoveEmit(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('ball', _data);
	}

	@SubscribeMessage('versus')
	async versusMatch(@ConnectedSocket() socket: Socket, @MessageBody() body: string) 
	{
		const b = body.split(':');
		console.log("b[0] = ",b[0]);
		console.log("b[1] = ",b[1]);
		this.server.emit('inviteToPlay', b[0], b[1]);

	}
	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		console.log("GET PLAYER AT GAME SERVER")

		this.server.emit('getPlayer', _data);	
	}
}