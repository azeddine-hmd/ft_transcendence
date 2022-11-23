
import Sidebar from '../../components/profile/Sidebar'
import Useravatar from '../../components/profile/Useravatar'
import React, { useEffect } from "react";
import io from 'socket.io-client';
import style from '../../styles/game/gameStyle.module.css'

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

function live()
{
    var p1:string ;
	var p2:string ;
    var canvas:any;
	var colorG:string = "green";
	var game:GameOption;
	var playerHeight:number = 75.0;
	var playerWith:number = 10;
	var ballHeight:number = 10;
	var sBall:number = 2;
	var socket:any;


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
		p1 = "";
		p2 = "";
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
	}

    useEffect(() =>{
      	canvas = document.getElementById('canvas');
        initilizeGame();
	    drawGame();     
        socket.on("live", (...args:any) => 
        {
            const arr = args[0].split(':');
            p1 = arr[1];
            p2 = arr[2];
            game.player1.score = arr[3];
            game.player2.score = arr[4];
            console.log("p1 = " + p1);
            console.log("p2 = " + p2);
        });
    },[])

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
                <canvas className={style.canvas} id="canvas" width={600} height={600}></canvas>
				<div>

					p1 3 vs 2 p2 


				</div>
            </div>
            </div>
            </div>
        </>
    );
}
export default live;