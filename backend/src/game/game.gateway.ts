import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
// import { UserService } from './game.service';

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

	// constructor(
    //         private readonly user: UserService
    // ) { }
   
	async handleConnection(socket: Socket, ...args: any[]) {
		console.log("CONNECTED AT GAME SERVER");
	}
	
	async handleDisconnect(socket: Socket, ...args: any[]) {
		console.log("DISCONNECTED AT GAME SERVER"); 
	}

	@SubscribeMessage('match')
	async messageMessage(@ConnectedSocket()  client: Socket,  @MessageBody() data: string)
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
				match[i].push(client.handshake.query.username);
			else
			{
				const index = match[i].indexOf(client.handshake.query.username);
				if (index > -1) 
				{
					match[i].splice(index, 1);
				}
			}
			if (match[i].length >= 2)
			{
				var index = match[i].indexOf(client.handshake.query.username);
				if (index != -1) 
					match[i].splice(index, 1);
				let contender = match[i][0];
				index = match[i].indexOf(contender);
				if (index != -1) 
					match[i].splice(index, 1);
				// this.server.to("abcd").emit('_start',client.handshake.query.username , contender, i);
				this.server.emit('_start',client.handshake.query.username , contender, i);
			}
		}
	}

	@SubscribeMessage('getResult')
	async gameEnd(@ConnectedSocket() socket: Socket, @MessageBody() _data: string) 
	{
		const arr = _data.split(' ');
	
			console.log("arr[0] = " + arr[0]);
			console.log("arr[1] = " + arr[1]);
	
	}
	@SubscribeMessage('ballPos')
	async ball(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
		this.server.emit('ballPos', _data);
	}

	@SubscribeMessage('getPlayer')
	async getPlayer(@ConnectedSocket() client: Socket, @MessageBody() _data: string) {
		this.server.emit('getPlayer', _data);	
	} 
}