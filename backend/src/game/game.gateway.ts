import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

let match:any = [[],[]];
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

	constructor(
		) { }

	async handleConnection(socket: Socket, ...args: any[]) {
		console.log("CONNECTED AT GAME SERVER");
	}
	
	async handleDisconnect(socket: Socket, ...args: any[]) {
		console.log("DISCONNECTED AT GAME SERVER");
	}

	@SubscribeMessage('match')
	async messageMessage(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		waiting = true;
		if(_data.toString().includes("cancel"))
			waiting = false;
		if (socket.handshake.query.username)
		{
			if(waiting)
				match[0].push(socket.handshake.query.username);
			console.log(match); 
			if (match[0].length >= 2)
			{
				var index = match[0].indexOf(socket.handshake.query.username);
				console.log(index);
				
				if (index != -1) 
					match[0].splice(index, 1);
				console.log(match); 
				let contender = match[0][0];
				index = match[0].indexOf(contender);
				if (index != -1) 
					match[0].splice(index, 1);
				console.log(match); 
				this.server.emit('_start',socket.handshake.query.username , contender);
			}
		}
	}

	@SubscribeMessage('ballPos')
	async ball(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('ballPos', _data);
	}

	@SubscribeMessage('startSocket')
	async versus(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		this.server.emit('startSocket', _data);	
	}

	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('getPlayer', _data);	
	}
	@SubscribeMessage('typeOfGame')
	async 0(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) {
		this.server.emit('typeOfGame', _data);	
	}
}