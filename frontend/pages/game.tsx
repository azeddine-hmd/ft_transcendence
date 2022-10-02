import Sidebar from '../components/profile/Sidebar'
import Useravatar from '../components/profile/Useravatar'
import { useEffect, useState } from 'react'
import React from "react";
import {Apis} from "../network/apis"
import { ErrorResponse } from '../network/dto/response/error-response.dto'
import { ProfileResponse } from '../network/dto/response/profile-response.dto'
import io from 'socket.io-client';

interface GameOption
{
	player1: {
		y:any,
		score: number,
	},
	player2: {
		y:any,
		score: number,
	},
	ball: {
		x: any,
		y: any,
		speed: {
			x: number,
			y: number
		},
	}
}
let url = "http://localhost:8080";

function Game()
{
	var anim:any;
	const [isActive, setActive] = React.useState(true);
	const [isActive2, setActive2] = React.useState(false);
	var p1:string = '';
	var p2:string = '';
	var playerName: string = '';
	var canvas:any;
	var game:GameOption;
	var playerHeight:number = 75;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sppedBall:number = 2;
	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");
	const [isWin, setWin] = React.useState(false);

	var socket:any;

	async function getUser()
	{
		let username = "";
		// Apis.CurrentProfile({
        //     onSuccess: (userResponse: ProfileResponse) => {
        //         setUser(userResponse.username);
		// 		username = userResponse.username;
		// 		playerName = username;

		// 		console.log("here",playerName);
		// 		setUsername(username);
        //     },
        //     onFailure: (err: ErrorResponse) => {
        //         alert("couldn't fetch user");
        //     },
        // });
	}

	function attack(player:any) 
	{
		var i: Number;
		i = game.player1.y + playerHeight;
		if (game.ball.y < game.player1.y || game.ball.y > i) 
		{
			game.ball.x = canvas.width / 2 - ballHeight / 2;
			game.ball.y = canvas.height / 2 - ballHeight / 2;
			game.ball.speed.y = sppedBall;

			if (player === game.player1) 
			{
				game.ball.speed.x = sppedBall * -1;
				game.player2.score++;
			} 
			else
			{
				game.ball.speed.x = sppedBall;
				game.player1.score++;
			}
		}
		else 
		{
			game.ball.speed.x = -2;
			game.ball.speed.y = -2;
		}
	}

	function ballMove()
	{
		// if (playerName === p1)
		// {
			if (game.ball.y > canvas.height || game.ball.y < 0) 
				game.ball.speed.y *= -1;
			if (game.ball.x > canvas.width - playerWith) 
				attack(game.player2);
			else if (game.ball.x < playerWith)
				attack(game.player1);
			game.ball.x -= game.ball.speed.x;
			game.ball.y -= game.ball.speed.y;
			socket.emit('ball', p1 + ":" + p2 + ":" + game.ball.x + ":" + game.ball.y + ":" + game.ball.speed.x + ":" + game.ball.speed.y);
		// }
	}


	function draw() 
	{
		var context = canvas.getContext('2d');
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = 'white';
		context.beginPath();
		context.setLineDash([16]);
		context.strokeRect(canvas.width / 2, 0 ,0, canvas.height);
		context.stroke();
		context.fillStyle = 'white';
		context.fillRect(0, game.player1.y, playerWith, playerHeight);
		context.fillRect(canvas.width - playerWith, game.player2.y, playerWith, playerHeight);
		context.beginPath();
		context.fillStyle = 'white';
		context.arc(game.ball.x, game.ball.y, ballHeight, 0, 4 * Math.PI);
		context.fill();
	}

	function initilizeGame() 
	{
		// socket.on("gameStart", (...args) => {
	// 	setWin(false);
		
	// 	p1 = args[0];
	// 	p2 = args[1];

	// 	initilizeGame();
	// 	if (p1 == playerName && game) {

	// 		cancelAnimationFrame(anim);
	// 		play();
	// 		setActive(false);
	// 		setActive2(false);
	// 	}
	// 	else if ( p2 == playerName && game) {
	
	// 		cancelAnimationFrame(anim);
	// 		play();
	// 		setActive(false);
	// 		setActive2(false);
	// 	}

	// });
		// socket.on("player", (_data: string) => {
		// const b = _data.split(':');
		// if (b[0] == p2 && playerName != p2) {
		// 	game.player2.y = b[1];
		// } else if (b[0] == p1 && playerName != p1) {
		// 	game.player1.y = b[1];
		// }
		// });

		socket.on("getPlayer", (_data: any) => {
			console.log('GOT DATA', _data);
			p1 = _data.p1;
			p2 = _data.p2;
		});

		game = {
			player1: {
				y: canvas.height / 2 - playerHeight / 2,
				score: 0,
			},
			player2: {
				y: canvas.height / 2 - playerHeight / 2,
				score: 0,
			},
			ball: {
				x: canvas.width / 2,
				y: canvas.height / 2,
				speed: {
					x: sppedBall,
					y: sppedBall,
				},
			}
		}
		draw();
	}

	function playerMove(event:any) 
	{
		console.log('-------------');
		var gameLocation = canvas.getBoundingClientRect();
		var mouseLocation = event.clientY - gameLocation.y;

		if (playerName === p1) 
		{
			game.player1.y = mouseLocation - playerHeight / 2;
			if (mouseLocation < playerHeight / 2) 
				game.player1.y = 0;
			else if (mouseLocation > canvas.height - playerHeight / 2) 
				game.player1.y = canvas.height - playerHeight;
			else 
				game.player1.y = mouseLocation - playerHeight / 2;
		}
		else if (playerName === p2) 
		{
			game.player2.y = mouseLocation - playerHeight / 2;
			if (mouseLocation < playerHeight / 2) 
				game.player2.y = 0;
			else if (mouseLocation > canvas.height - playerHeight / 2) 
				game.player2.y = canvas.height - playerHeight;
			else 
				game.player2.y = mouseLocation - playerHeight / 2;

		}
		// console.log(playerName);
		// console.log(p2);
		
		// if (playerName === p2 && playerName && game.player1.y )
		// {			
		// 	socket.emit('player', playerName + ":" + game.player2.y);
		// }		
		// if (playerName === p1 && playerName && game.player1.y )
		// 	socket.emit('player', playerName + ":" + game.player1.y);
	}




	
	function startGame()
	{
		setInterval( function () {
			ballMove();
			draw();
		}, 1000 * 0.01)
	}

	useEffect(() => {

		Apis.CurrentProfile({
            onSuccess: (userResponse: ProfileResponse) => {
				let username = "";

				setUser(userResponse.username);
				username = userResponse.username;
				playerName = username;

				setUsername(username);

				socket = io(url + "/game",{ transports: ['websocket']});

				canvas = document.getElementById('canvas');
				initilizeGame();

				// GET PLAYERS NAMES
				socket.emit('getPlayer');

				// MOVE MOUSE
				if (playerName === p1 || playerName === p2)
					canvas.addEventListener('mousemove', playerMove);

				// usr logged
				// enemy

				console.log(playerName);
				console.log(p1);
				console.log(playerName === p1);
				console.log(p2);
				console.log(playerName === p2);
				
				startGame();
            },
            onFailure: (err: ErrorResponse) => {
                alert("couldn't fetch user");
            },
        });


	}, []);

	return (
        <>
         <div className="homepage w-full h-screen min-w-full relative">
        	<img src="/profile/bg.png" className="  w-full h-full min-w-full " alt="" />
            	<div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] ">
				</div>
        			<div className="contain absolute top-0 w-full h-screen flex justify-between">
            			<Sidebar/>
            		<div className="contentss w-full  h-screen py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
              			<Useravatar avata={"/profile/Avatar.png"} userid={"amine ajdahim"} />


				
						<div id="game-root">
						<p className="scor" id="scores">
						<b className="scor" id="playerOne"></b>
						<b className="scor" id="playerOneScore">0</b> - <b id="playerTwo"></b>
						<b className="scor" id="playerTwoScore">0</b></p>	
						<canvas id="canvas" width={800} height={500} style={{cursor: "none"}}></canvas>		
						</div>


						
          </div>
        </div>
    </div>
	</>
    );
}
export default Game;

