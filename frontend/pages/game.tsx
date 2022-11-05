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
		r:any,
		speed: {
			x: number,
			y: number
		},
		speed1:number,
	}
}

let url = "http://localhost:8080";

function Game()
{
	var _typeOfGame:number;
	var contender: string;
	var checkSearching:boolean = false;
	var p1:string ;
	var p2:string ;
	var array1:any;
	var array0:any;
	var array2:any;
	var playerName: string ;
	var canvas:any;
	var colorG:string = "green";
	var game:GameOption;
	var playerHeight:number = 75;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sBall:number = 2;
	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");

	var socket:any;
	socket = io(url + "/game",{ query: { username: username } ,transports: ['websocket']});

	function _search()
	{
		let i:number = 0;
		checkSearching = checkSearching ? false : true;
		if(checkSearching)
			socket.emit('match', i);
		else
			socket.emit('match', "cancel");
	}

	function ballMove()
	{
		if (game.ball.y > canvas.height || game.ball.y < 0) 
			game.ball.speed.y *= -1;
		if (game.ball.x > canvas.width - playerWith) 
		{
			if (game.ball.y < game.player2.y || (game.ball.y > game.player2.y + playerHeight))
			{
				game.ball.x = canvas.width / 2;
				game.ball.y = canvas.height / 2;
				game.ball.speed.y = sBall;
				game.ball.speed.x = sBall;
				game.player2.score++;				
			}
			else
				{
					game.ball.speed.x *=-1;
					let collidePoint = (game.ball.y - (game.player2.y + playerHeight/2));
					collidePoint = collidePoint / (playerHeight/2);
					let angleRad = (Math.PI/4) * collidePoint;
					let direction = (game.ball.x + game.ball.r < canvas.width/2) ? 1 : -1;
					game.ball.speed.x = direction * game.ball.speed1 * Math.cos(angleRad);
					game.ball.speed.y = game.ball.speed1 * Math.sin(angleRad);
					game.ball.speed1 += 0.1;
				}
		}
		else if (game.ball.x < playerWith)
		{
			if (game.ball.y < game.player1.y || game.ball.y > (game.player1.y + playerHeight)) 
			{
				game.ball.x = canvas.width / 2 - ballHeight / 2;
				game.ball.y = canvas.height / 2 - ballHeight / 2;
				game.ball.speed.x = sBall * -1;
				game.ball.speed.y = sBall;
				game.player1.score++;
			}
			else
			{	
				 game.ball.speed.x *=-1;
				let collidePoint = (game.ball.y - (game.player1.y + playerHeight/2));
				collidePoint = collidePoint / (playerHeight/2);
				let angleRad = (Math.PI/4) * collidePoint;
				let direction = (game.ball.x + game.ball.r < canvas.width/2) ? 1 : -1;
				game.ball.speed.x = direction * game.ball.speed1 * Math.cos(angleRad);
				game.ball.speed.y = game.ball.speed1 * Math.sin(angleRad);
				game.ball.speed1 += 0.1;
			}
		}
		game.ball.x += game.ball.speed.x;
		game.ball.y += game.ball.speed.y;
		socket.emit('ballPos', p1 + " " + p2 + " " + game.ball.x + " " + game.ball.y + " " + game.player1.score + " " + game.player2.score);
	}

	function colorRect(leftX:number , topY:number, width:number, height:number, drawColor:string) 
	{
		var context = canvas.getContext('2d');
		context.fillStyle = drawColor;
		context.fillRect(leftX,topY, width,height);
	}	

	function Sacors()
	{
		var c = canvas.getContext('2d');		
		c.font = '80px Courier New';
		c.textAlign = 'center';
		c.fillStyle = 'White';
		c.fillText(game.player2.score, 200, 100);
		c.fillText(game.player1.score, 400, 100);
	}

	function drawNet() 
	{
        for(var i:number = 0; i < canvas.height; i += 40) 
            colorRect(canvas.width/2 - 1, i, 2, 20, colorG);
    }

	function drawBall()
	{
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = colorG;
		ctx.arc(game.ball.x, game.ball.y, ballHeight, 0, Math.PI * 2, false);
		ctx.fill();
	}

	function drawPaddle() 
	{
		var context = canvas.getContext('2d');
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = colorG;
		context.beginPath();
		context.fillStyle = colorG;
		context.fillRect(0, game.player1.y, playerWith, playerHeight);
		context.fillRect(canvas.width - playerWith, game.player2.y, playerWith, playerHeight);		
	}

	function drawGame()
	{		
		drawPaddle();
		drawBall();
		drawNet();
		Sacors();
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
				r: ballHeight,
				speed1: 7,
			}
		}
		drawGame();
		p1 = "";
		p2 = "";
	}

	function init_socket()
	{	
		socket.on("_start", (...args:any) => 
		{
			p1 = args[0];
			p2 = args[1];
			if (p1 != contender && p1 == playerName && game) 
			{
				contender = p2;
				startGame();    
			}
			else if (p2 != contender && p2 == playerName && game) 
			{
				contender = p1;
				startGame();
			}
		});
		socket.on("getPlayer", (_data: string) => 
		{
			array0 = _data.split(' ');
			if (array0[0] == p2 && playerName != p2) 
				game.player2.y = array0[1];
			else if (array0[0] == p1 && playerName != p1) 
				game.player1.y = array0[1];
		});
		socket.on("ballPos", (_data: string) =>
		{
			array1 = _data.split(' ');
			if (playerName == p2 && p2 == array1[1] && p1 == array1[0])
			{
				game.ball.x = array1[2];
				game.ball.y = array1[3];
				game.player1.score = array1[4];
				game.player2.score = array1[5];
			}
		});
		socket.on("typeOfGame",(_data: string) =>
		{
			array2 = _data.split(' ');
			_typeOfGame = array2[0];
		}
		);
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
			if (playerName && contender && game.player1.y)
				socket.emit('getPlayer', playerName + " " + game.player1.y);
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
			if (playerName && contender && game.player1.y)
				socket.emit('getPlayer', playerName + " " + game.player2.y);
		}
	}

	function startGame()
	{
		setInterval( function () 
		{
			if (playerName === p1 || playerName === p2)
			{	
				drawGame();
				canvas.addEventListener('mousemove', playerMove);
			}		
			if(playerName == p1)
				ballMove();
		}, 1000 * 0.04)
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
				socket.emit('startSocket', playerName);
				init_socket();
				initilizeGame();
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
