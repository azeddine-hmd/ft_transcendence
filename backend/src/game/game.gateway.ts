import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

let MatchMaking = [[], [], [], [], []];
let vs1:any = [];
let vs2:any = [];

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
		const b = _data.split(':');
	}
	@SubscribeMessage('player')
	async player(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		const b = _data.split(':');
		this.server.emit('player', _data);
		console.log(_data);
		// game
    }

	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		console.log("GET PLAYER AT GAME SERVER")

		this.server.to(socket.id).emit('getPlayer', { p1: "azzedine", p2: "fbouibao" });
	}
}