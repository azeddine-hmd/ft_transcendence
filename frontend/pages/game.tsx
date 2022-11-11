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
		y:number,
		score: number,
	},
	player2: {
		y:number,
		score: number,
	},
	ball: {
		x: number,
		y: number,
		r:number,
		speed: {
			x: number,
			y: number
		},
	}
}

let url = "http://localhost:8080";

function Game()
{

	// let hit = new Audio();
	// let wall = new Audio();
	// let userScore = new Audio();
	// let comScore = new Audio();
	// hit.src = "sounds/hit.mp3";
	// wall.src = "sounds/wall.mp3";
	// comScore.src = "sounds/comScore.mp3";
	// userScore.src = "sounds/userScore.mp3";
	var acl:number;
	let buttomSearch:any = [];
	buttomSearch[0] = "search";
	var _typeOfGame:string = "easy";
	var contender: string;
	var matchIsMake:boolean = false;
	var optionIsMake:boolean = false;
	var p1:string ;
	var p2:string ;
	var array1:any;
	var array0:any;
	var array2:any;
	var playerName: string ;
	var canvas:any;
	var colorG:string = "green";
	var game:GameOption;
	var playerHeight:number = 75.0;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sBall:number = 2;
	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");
	const [mode, chanScopeSet] = React.useState("Easy");
	const [mode1, chanScopeSet1] = React.useState("Right");
	const [is, set] = React.useState(true);

	var socket:any;
	socket = io(url + "/game",{ query: { username: username } ,transports: ['websocket']});
function _mode(m:number)
{
	if(m == 0)
		acl = 1;
	else
		acl = 4;
}
	function _search()
	{		
		// let isMounted = true;
		// if(isMounted)
		// 	set(false);		
		// isMounted = false;
		buttomSearch[0] = "search";
		let i:number = 0;
		if (matchIsMake)
		{

			matchIsMake = false;
		}
		else
			matchIsMake = true;
		if(matchIsMake)
		{
			buttomSearch[0] = "cancel";
			console.log("mode = " + mode);
			console.log("mode1 = " + mode1);
			
			socket.emit('match', mode + mode1);
		}
		
		else
			socket.emit('match', "cancel");
		let v =	document.querySelector('#search'); 
		if (v)
			v.textContent = buttomSearch[0];
	}

	function typegame()
	{
		let i:number = 0;
		if (optionIsMake)
		{
			_typeOfGame = "esay";
			optionIsMake = false;
		}
		else
			optionIsMake = true;
		if(optionIsMake)
		{
			
			_typeOfGame = "hard";
			socket.emit('match', i);
		}
		
		else
			socket.emit('type', _typeOfGame);
		let v =	document.querySelector('#option'); 
		if (v)
			v.textContent = _typeOfGame;

	}
	function ballMove()
	{
		var d:number;		
		var e:number;
		d = Number(game.player2.y) + Number(playerHeight);
		e = Number(game.player1.y) + Number(playerHeight);
		if (game.ball.y > canvas.height || game.ball.y < 0) 
			game.ball.speed.y *= -1;
		if (game.ball.x > canvas.width - playerWith) 
		{
			if (game.ball.y < game.player2.y || (game.ball.y > d))
			{
				game.ball.x = canvas.width / 2;
				game.ball.y = canvas.height / 2;
				game.ball.speed.y = sBall;
				game.ball.speed.x = sBall;
				// userScore.play();
				game.player2.score++;				
			}
			else
			{
				var a:number = Number(playerHeight/2);
				var b:number = Number(game.player2.y) + a;
				var c:number = Number(game.ball.y) - b;
				var collidePoint:number = c;				
				collidePoint = collidePoint / a;
				let angleRad:number = (Math.PI/4) * collidePoint;
				let direction:number = ((game.ball.x + game.ball.r) < canvas.width/2) ? 1 : -1;
				game.ball.speed.x = direction * sBall * Math.cos(angleRad);
				game.ball.speed.y = sBall * Math.sin(angleRad);
				sBall += 0.1;

			}
		}
		else if (game.ball.x < playerWith)
		{
			if (game.ball.y < game.player1.y || game.ball.y > e) 
			{ 	
				game.ball.x = canvas.width / 2 - ballHeight / 2;
				game.ball.y = canvas.height / 2 - ballHeight / 2;
				game.ball.speed.x = sBall * -1;
				game.ball.speed.y = sBall;
				// userScore.play();
				game.player1.score++;
			}
			else
			{	
				let collidePoint:number = (game.ball.y - (game.player1.y + playerHeight/2));
				collidePoint = collidePoint / (playerHeight/2);
				let angleRad:number = (Math.PI/4) * collidePoint;
				let direction:number = ((game.ball.x + game.ball.r) < canvas.width/2) ? 1 : -1;
				game.ball.speed.x = direction * sBall * Math.cos(angleRad);
				game.ball.speed.y = sBall * Math.sin(angleRad);
				sBall += 0.1;
			}
		}
		game.ball.x += game.ball.speed.x*acl;
		game.ball.y += game.ball.speed.y*acl;
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
		drawNet();	
		Sacors();
		drawBall();
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
				r: ballHeight/2,
			}
		}
		buttomSearch[0] = "search";
		drawGame();
		p1 = "";
		p2 = "";
	}
	socket.on("_start", (...args:any) => 
	{
		p1 = args[0];
		p2 = args[1];
		_mode(args[2])
		if (p1 != contender && p1 == playerName && game) 
			contender = p2;
		else if (p2 != contender && p2 == playerName && game) 
			contender = p1;
	});
	function init_socket()
	{
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
			if (playerName == p1 || playerName === p2)
			{		
				set(false);
				drawGame();
				canvas.addEventListener('mousemove', playerMove);
			}		
			if(playerName == p1)
				ballMove();
		}, 1000 * 0.02)
	}

	useEffect(() => {
		Apis.CurrentProfile( {
            onSuccess: (userResponse: ProfileResponse) => {
				let username = "";
				setUser(userResponse.username);
				username = userResponse.username;
				playerName = username;
				setUsername(username);
				console.log("username =  " + username);

				canvas = document.getElementById('canvas');
				socket.emit('startSocket', playerName);
				init_socket();	
				startGame();   			
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

						<canvas className={style.canvas} id="canvas" width={600} height={600} style={{cursor: "none"}}></canvas>				
						{ is ? <div className={ style.overlay}>					
							<div className={style.prompt}>
								<div>How would you like to play?</div>
								<hr className={style.hr}/>
								<div className={style.difficulty}>
									<span><input id="hard" type="radio" name="difficulty" value="Hard" onChange={e => chanScopeSet(e.target.value)}/>
									<label htmlFor="hard">Hard</label></span>
									<span><input id="Easy" type="radio" name="difficulty" value="Easy" onChange={e => chanScopeSet(e.target.value)}/>
									<label htmlFor="Easy">Easy</label></span>
									</div>
									<hr className={style.hr}/>
			
									{/* <div className={style.character}>
									<span><input id="Right" type="radio" name="character" value="Right" onChange={e => chanScopeSet1(e.target.value)}/>
									<label htmlFor="Right">Right</label></span>	
									<span><input id="Left" type="radio" name="character" value="Left" onChange={e => chanScopeSet1(e.target.value)} />
									<label htmlFor="Left">Left</label></span>
									</div> */}
									<hr className={style.hr}/>

									<div className={style.start}>
							<button type="button" id="search" className={style.button1}	 onClick={() => _search()}>{buttomSearch[0]}</button>
 
								</div>
							</div>	
						</div> : ""}


						<div className={style.restart}> <button id="restart"> Restart </button> </div>









					</div>
    			</div>
    		</div>
	</>
    );
}

export default Game;
