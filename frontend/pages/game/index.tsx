import Sidebar from '../../components/profile/Sidebar'
import Useravatar from '../../components/profile/Useravatar'
import { useEffect, useState } from 'react'
import React from "react";
import { Apis } from "../../network/apis"
import { ErrorResponse } from '../../network/dto/response/error-response.dto'
import { ProfileResponse } from '../../network/dto/response/profile-response.dto'
import io from 'socket.io-client';
import style from '../../styles/game/gameStyle.module.css'
import { Router, useRouter } from 'next/router';
import Popup from "../../components/popup"

interface GameOption {
	player1: {
		y: number,
		score: number,
	},
	player2: {
		y: number,
		score: number,
	},
	ball: {
		x: number,
		y: number,
		r: number,
		speed: {
			x: number,
			y: number
		},
	}
}
// let url = "";
// if (process.env.REACT_APP_IP == "" || process.env.REACT_APP_IP == undefined)
// 	url = "http://localhost";
// else
// 	url = "http://".concat(process.env.REACT_APP_IP);
let url = process.env.NEXT_PUBLIC_API_BASE_URL;

const socket = io(url + '/game', {
	withCredentials: true,
	transports: ['websocket'],
});
let gameIndex = 0;
let px: number;
let py: number;
export { socket };

function Game() {
	var _mode: number;
	let counter: any;
	let buttomSearch: any = [];
	buttomSearch[0] = "search";
	var contender: string;
	var matchIsMake: boolean = false;
	var p1: string;
	var p2: string;
	var array1: any;
	var playerName: string;
	var canvas: any;
	var colorG: string = "white";
	var game: GameOption;
	var playerHeight: number = 75;
	var playerWith: number = 10;
	var ballHeight: number = 10;
	var sBall: number = 2;
	const [user, setUser] = useState("");
	const [username, setUsername] = React.useState("");
	const [mode, chanScopeSet] = React.useState("Easy");
	const [is, set] = React.useState(true);
	const [isWinerLoser, setLoserWiner] = useState("");
	const [pone, setName] = React.useState("");
	const [ptwo, setName1] = React.useState("");
	const [scr1, setscr1] = React.useState(0);
	const [scr2, setscr2] = React.useState(0);
	const router = useRouter()

	

	const Refreche = () => {
		socket.emit("leaveGame", playerName + " " + mode + " " + gameIndex)
		getResult();
		socket.off("ballPos");
		router.push('/game')
	}
	useEffect(() => {
		socket.connect();
		canvas = document.getElementById('canvas');
		initilizeGame();
		socket.on("abcd", (...args: any) => {
			setscr1(0)
		setscr2(0)
			addEventListener('mousemove', playerMove);
			set(false);
			p1 = args[0];
			p2 = args[1];
			_mode = args[2];
			setName(p1);
			setName1(p2);
			gameIndex = (Number(args[3]));
			if (p1 != contender && p1 == playerName)
				contender = p2;
			else if (p2 != contender && p2 == playerName)
				contender = p1;
			socket.on("ballPos", (_data: string) => {
				array1 = _data.split(' ');
				game.ball.x = Number(array1[2]);
				game.ball.y = Number(array1[3]);
				game.player1.score = Number(array1[4]);
				game.player2.score = Number(array1[5]);
				game.player1.y = Number(array1[6]);
				game.player2.y = Number(array1[7]);
				drawGame();
			});
		});
		socket.emit('checkInvite');
		socket.on("endGame", (_data: string) => {
			socket.off("ballPos");
			getResult();
			removeEventListener("mousemove", playerMove);
		})
		return () => {
			socket.off('ballPos')
			socket.disconnect()
			removeEventListener("mousemove", playerMove);
		}
	}, [])

	function _search() {
		buttomSearch[0] = "search";
		let i: number = 0;
		if (matchIsMake)
			matchIsMake = false;
		else
			matchIsMake = true;
		if (matchIsMake) {
			buttomSearch[0] = "cancel";
			socket.emit('match', mode);
		}
		else
			socket.emit('match', "cancel");
		let v = document.querySelector('#search');
		if (v)
			v.textContent = buttomSearch[0];
	}

	function colorRect(leftX: number, topY: number, width: number, height: number, drawColor: string) {
		var context = canvas.getContext('2d');
		context.fillStyle = drawColor;
		context.fillRect(leftX, topY, width, height);
	}

	function Sacors() {
		var c = canvas.getContext('2d');
		c.font = '80px Courier New';
		c.textAlign = 'center';
		c.fillStyle = 'White';
		c.fillText(game.player2.score, 200, 100);
		c.fillText(game.player1.score, 400, 100);
	}

	function drawNet() {
		for (var i: number = 0; i < canvas.height; i += 40)
			colorRect(canvas.width / 2 - 1, i, 2, 20, colorG);
	}

	function drawBall() {
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.fillStyle = "Chartreuse";
		ctx.arc(game.ball.x, game.ball.y, ballHeight, 0, Math.PI * 2, false);
		ctx.fill();
	}

	function drawPaddle() {

		var context = canvas.getContext('2d');
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = "Chartreuse";
		context.fillStyle = "Chartreuse";
		context.fillRect(0, game.player1.y, playerWith, playerHeight);
		context.fillRect(canvas.width - playerWith, game.player2.y, playerWith, playerHeight);
	}

	function drawGame() {
		drawPaddle();
		drawNet();
		Sacors();
		drawBall();
	}

	function initilizeGame() {
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
				r: ballHeight / 2,
			}
		}
		buttomSearch[0] = "search";
		clearInterval(counter);
	}

	function playerMove(event: any) {
		
		var mousePos = event.clientY;
		if (playerName === p1) {
			game.player1.y = mousePos - playerHeight / 2;
			if (mousePos < playerHeight / 2)
				game.player1.y = 0;
			else if (mousePos > canvas.height- playerHeight / 2)
				game.player1.y = canvas.height - playerHeight;
			else
				game.player1.y = mousePos - playerHeight / 2;
			if (playerName && game.player1.y != null) {
				socket.emit('getPlayer', _mode + " " + gameIndex + " " + p1 + " " + Number(game.player1.y));
			}
		}
		else if (playerName === p2) {
			game.player2.y = mousePos - playerHeight / 2;
			if (mousePos < playerHeight / 2)
				game.player2.y = 0;
			else if (mousePos > canvas.height - playerHeight / 2)
				game.player2.y = canvas.height - playerHeight;
			else
				game.player2.y = mousePos - playerHeight / 2;
			if (playerName && game.player1.y != null) {
				socket.emit('getPlayer', _mode + " " + gameIndex + " " + p2 + " " + Number(game.player2.y));
			}
		}
	}

	function getResult() {
		if (Number(game.player1.score) > Number(game.player2.score) || Number(game.player1.score) < Number(game.player2.score)) {
				console.log("hello");
				
				setLoserWiner("Game Over");
				setPop(true);
			
		}
		setscr1(game.player1.score)
		setscr2(game.player2.score)
		game.ball.speed.x = 0;
		game.ball.speed.y = 0;
		game.ball.x = canvas.width / 2 - ballHeight / 2;
		game.ball.y = canvas.height / 2 - ballHeight / 2;
		game.player1.y = canvas.height / 2 - playerHeight / 2;
		game.player2.y = canvas.height / 2 - playerHeight / 2;
		set(true);
	}

	Apis.CurrentProfile({
		onSuccess: (userResponse: ProfileResponse) => {
			setUser(userResponse.username);
			playerName = userResponse.username;
			setUsername(userResponse.username);
			canvas = document.getElementById('canvas');
			initilizeGame();
			drawGame();

		},
		onFailure: (err: ErrorResponse) => {
			// callAlert();
		},
	});
	const [popup, setPop] = useState(false);
	console.log(isWinerLoser);
	
	return (
		<>
			{popup ? <div className="popup absolute justify-center  z-50 w-full items-center h-full flex  ">
                <div className="bgopaci absolute top-0 left-0 w-full h-full  min-w-full bg-opacity-95  bg-[#463573] " onClick={() => console.log("close")}></div>
                <div className="popupsettings absolute z-10 bg-white w-[50%] sm:w-[75%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[600px] h-[20%] rounded-[18px]">
                    <div className="closebtn w-full flex justify-end p-8">
                        <button className="text-[23px]  flex justify-end text-[#000] w-[30px] " onClick={() => setPop(false)} ><img src="/profile/popup/exit.png" alt="" /></button>
                    </div>
                    <div className="avatar flex relative justify-center flex-col h-[40%] items-center w-full ">
                        <h1 className="text-[100px] text-[#f44646]">Game Over</h1>
                    </div>
                </div>
            </div>
			: <></>}
			<div className="homepage overflow-y-scroll h-full w-full  min-w-full relative">
				<img src="/profile/bg.png" className="  w-full h-screen min-w-full " alt="" />
				<div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
				<div className="contain absolute top-0 w-full h-full flex justify-center">
					<div className="si xl:flex relative lg:hidden md:hidden z-60  sm:hidden hidden" >
						<Sidebar />
					</div>
					<div className="contentss w-full   flex-col ">
						<Useravatar avata={"/profile/Avatar.png"} userid={username} />
						<div className="resultplayers   w-[100%]  flex justify-center ">
							<div className="justcenter flex justify-between items-center rounded-[20px] w-[80%] h-[110px] px-7 bg-[#49367c] my-5 bg-opacity-90">
								<div className="player1 flex items-center justify-between w-[50%] ">
									<div className="avatarwithuser flex items-center">
										<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
											<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
										</div>
										<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{ptwo}</div>
									</div>
									<div className="resultnum text-[19px] text-[#bdb6d0] ">
										{scr2}
									</div>
								</div>
								<div className="vs  text-[19px] font-bold  px-4 text-[#dde4db]">VS</div>
								<div className="player2 flex items-center justify-between w-[50%]">
									<div className="resultnum text-[19px] text-[#bdb6d0] ">
										{scr1}
									</div>
									<div className="avatarwithuser flex items-center">
										<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{pone}</div>
										<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
											<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
										</div>
									</div>
								</div>
							</div>
						</div>
						<canvas className={style.canvas} id="canvas" width={600} height={600}></canvas>
						{is ? <div className={` ${style.overlay}`}>
							<div className={`flex w-[100%] justify-center items-center xl:mr-[368px]`}>
								<div className={`popcenter flex sm:h-[24%] h-[300px] ${style.prompt}`}>
									<div className='w-full flex justify-center'>How would you like to play?</div>
									<div className={style.difficulty}>
										<span><input id="hard" type="radio" name="difficulty" value="Hard" onChange={e => chanScopeSet(e.target.value)} />
											<label htmlFor="hard">Hard</label></span>
										<span><input id="Easy" type="radio" name="difficulty" value="Easy" onChange={e => chanScopeSet(e.target.value)} />
											<label htmlFor="Easy">Easy</label></span>
									</div>
									<hr className={style.hr} />
									<div className={style.start}>
										<button type="button" id="search" className={style.button1} onClick={() => _search()}>{buttomSearch[0]}</button>
									</div>
								</div>
							</div>
						</div> : ""}

						<div className={style.start}> <button id="restart" onClick={Refreche}>Retry</button> </div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Game;
