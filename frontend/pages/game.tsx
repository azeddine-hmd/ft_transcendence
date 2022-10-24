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
	const routeChange = (e: any) => {
        e.preventDefault();
		if(window.top)
        	window.top.location = url.concat("/game")
    }
	var p1:string = 'helloasd';
	var p2:string = 'hello000';
	var playerName: string ;
	var canvas:any;
	var game:GameOption;
	var playerHeight:number = 75;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sppedBall:number = 2;
	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");
	var socket:any;
	
	function attack(player:any) 
	{
		var i: Number;
		i = game.player1.y + playerHeight;
		if (game.ball.y < game.player1.y || game.ball.y > i) 
		{
			game.ball.x = canvas.width / 2 - ballHeight / 2;
			game.ball.y = canvas.height / 2 - ballHeight / 2;
			game.ball.speed.y = sppedBall;

			if (player === p1) 
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
			if (game.ball.y > canvas.height || game.ball.y < 0) 
				game.ball.speed.y *= -1;
			if (game.ball.x > canvas.width - playerWith) 
			{
				var i: Number;
				i = game.player2.y + playerHeight;
				if (game.ball.y < game.player2.y || game.ball.y > i) 
				{
					game.ball.x = canvas.width / 2 - ballHeight / 2;
					game.ball.y = canvas.height / 2 - ballHeight / 2;	
					if (p2 === playerName) 
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
					console.log("here ");
					
					game.ball.speed.x = -2;
					game.ball.speed.y = -2;
				}
			}
				// attack(p2);
			else if (game.ball.x < playerWith)
			{
				var i: Number;
				i = game.player1.y + playerHeight;
				if (game.ball.y < game.player1.y || game.ball.y > i) 
				{
					game.ball.x = canvas.width / 2 - ballHeight / 2;
					game.ball.y = canvas.height / 2 - ballHeight / 2;
					if (p1 === playerName) 
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
				// attack(p1);
			game.ball.x -= game.ball.speed.x;
			game.ball.y -= game.ball.speed.y;
			socket.emit('ball', p1 + ":" + p2 + ":" + game.ball.x + ":" + game.ball.y + ":" + game.ball.speed.x + ":" + game.ball.speed.y);
	}

	function draw() 
	{
		var context = canvas.getContext('2d');
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = 'white';
		context.beginPath();
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

	function init_socket()
	{

		socket.on("gameStart", (...args:any) => 
		{
			p1 = args[0];
			p2 = args[1];
			
			
		});
		socket.on("getPlayer", (_data: string) => 
		{
		const b = _data.split(':');
		if (b[0] == p2 && playerName != p2) 
			game.player2.y = b[1];
		else if (b[0] == p1 && playerName != p1) 
			game.player1.y = b[1];
		});

		socket.on("ball", (body: string) =>
		{
			const b = body.split(':');
			if ((playerName == p2 && p2 == b[1] && p1 == b[0])) {
				game.ball.x = b[2];
				game.ball.y = b[3];
					draw();
			}
		});
	}

	function playerMove(event:any) 
	{
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
		if (playerName === p2 && playerName && game.player1.y )
			socket.emit('getPlayer', playerName + ":" + game.player2.y);
		if (playerName === p1 && playerName && game.player1.y )
			socket.emit('getPlayer', playerName + ":" + game.player1.y);
	}

	function startGame()
	{
		setInterval( function () {
			ballMove();
			draw();
		}, 1000 * 0.01)
	}

	useEffect(() => {
		Apis.CurrentProfile( {
            onSuccess: (userResponse: ProfileResponse) => {
				let username = "";
				setUser(userResponse.username);
				username = userResponse.username;
				playerName = username;
				setUsername(username);
				socket = io(url + "/game",{ transports: ['websocket']});
				canvas = document.getElementById('canvas');
						
				socket.emit('versus', playerName);
				init_socket();
				initilizeGame();
				if (playerName === p1 || playerName === p2)
					canvas.addEventListener('mousemove', playerMove);
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
						<canvas id="canvas" width={310} height={310} style={{cursor: "none"}}></canvas>
					</div>
    			</div>
    		</div>
    	</div>
	</>
    );
}

export default Game;
