import Sidebar from '../components/profile/Sidebar'
import Useravatar from '../components/profile/Useravatar'
import { useEffect, useState } from 'react'
import React from "react";
import {Apis} from "../network/apis"
import { ErrorResponse } from '../network/dto/response/error-response.dto'
import { ProfileResponse } from '../network/dto/response/profile-response.dto'
import io from 'socket.io-client';
import style from '../styles/game/gameStyle.module.css'

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
	var p1:string ;
	var p2:string ;
	var playerName: string ;
	var canvas:any;
	var game:GameOption;
	var playerHeight:number = 75;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sBall:number = 2;
	var socket:any;

	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");

	socket = io(url + "/game",{ query: { username: username } });

	function _search()
	{
		let i:number = 0;
		socket.emit('match', i);
	}

	function attack()
	{
		var i: Number;
		var player:any;		
		if (game.ball.x > canvas.width - playerWith) 
			player == p2;
		else if (game.ball.x < playerWith)
			player == p1;
		i = game.player1.y + playerHeight;
		if (game.ball.y < game.player1.y || game.ball.y > i) 
		{
			game.ball.x = canvas.width / 2 - ballHeight / 2;
			game.ball.y = canvas.height / 2 - ballHeight / 2;
			if (p1 === player) 
			{
				game.ball.speed.x = sBall * -1;
				game.player2.score++;
			} 
			else
			{
				game.ball.speed.x = sBall;
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
		attack();
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
					x: sBall,
					y: sBall,
				},
			}
		}		
		p1 = "";
		p2 = "";
		draw();
	}

	function init_socket()
	{
		socket.on("_start", (...args:any) => 
		{
			p1 = args[0];
			p2 = args[1];
			console.log(p1 + " " + p2 );
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
		var gamePos = canvas.getBoundingClientRect();
		var mousePos = event.clientY - gamePos.y;

		if (playerName === p1) 
		{
			game.player1.y = mousePos - playerHeight / 2;
			if (mousePos < playerHeight / 2) 
				game.player1.y = 0;
			else if (mousePos > canvas.height - playerHeight / 2) 
				game.player1.y = canvas.height - playerHeight;
			else 
				game.player1.y = mousePos - playerHeight / 2;
		}
		else if (playerName === p2) 
		{
			game.player2.y = mousePos - playerHeight / 2;
			if (mousePos < playerHeight / 2) 
				game.player2.y = 0;
			else if (mousePos > canvas.height - playerHeight / 2) 
				game.player2.y = canvas.height - playerHeight;
			else 
				game.player2.y = mousePos - playerHeight / 2;
		}
		if (playerName === p2 && playerName && game.player1.y )
			socket.emit('getPlayer', playerName + ":" + game.player2.y);
		if (playerName === p1 && playerName && game.player1.y )
			socket.emit('getPlayer', playerName + ":" + game.player1.y);
	}

	function startGame()
	{
		setInterval( function () {
			if (playerName === p1 || playerName === p2)
			{
				ballMove();
				canvas.addEventListener('mousemove', playerMove);
			}		
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
				canvas = document.getElementById('canvas');
				socket.emit('versus', playerName);
				init_socket();
				initilizeGame();
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
						<button type="button" className={style.button1} onClick={() => _search()}>{"search"}</button>
						<canvas className={style.canvas} id="canvas" width={600} height={600} style={{cursor: "none"}}></canvas>
					</div>
    			</div>
    		</div>
    	</div>
	</>
    );
}

export default Game;
