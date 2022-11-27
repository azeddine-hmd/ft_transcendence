import Sidebar from '../../components/profile/Sidebar'
import Useravatar from '../../components/profile/Useravatar'
import React, { useEffect, useState } from "react";
import io, { Socket } from 'socket.io-client';
import style from '../../styles/game/gameStyle.module.css'

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
var socket: any;
let url = "http://" + "localhost" + ":8080";
socket = io(url + "/game", { transports: ['websocket'] });
export { socket };

function live() {
	let buttomSearch: any = [];
	buttomSearch[0] = "search";
	var p1: string;
	var p2: string;
	var canvas: any;
	var colorG: string = "white";
	var playerHeight: number = 75.0;
	var playerWith: number = 10;
	var ballHeight: number = 10;
	var sBall: number = 2;

	var game: GameOption = initgame();

	const [easyGames, setEasyGames] = useState<[]>([]);
	const [hardGames, setHardGames] = useState<[]>([]);


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
		ctx.fillStyle = colorG;
		ctx.arc(game.ball.x, game.ball.y, ballHeight, 0, Math.PI * 2, false);
		ctx.fill();
	}

	function drawPaddle() {
		var context = canvas.getContext('2d');
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = colorG;
		context.fillStyle = colorG;
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
	}
	function initgame() {
		return {
			player1: {
				y: 600 / 2 - playerHeight / 2,
				score: 0,
			},
			player2: {
				y: 600 / 2 - playerHeight / 2,
				score: 0,
			},
			ball: {
				x: 600 / 2,
				y: 600 / 2,
				speed: {
					x: sBall,
					y: sBall,
				},
				r: ballHeight / 2,
			}
		}
	}
	function ft() {
		console.log("ft", socket, url);
		socket.emit("live", {});
	}
	function ft1() {
		// console.log("ft1");
		socket.emit("test");
	}
	function ft2() {
		// console.log("empty games");
		socket.emit("clear");
	}
	function join(mode: string, index: number) {
		// join game
		// console.log('joinning', mode, index);

		socket.emit('joingame', mode + " " + index)
	}

	socket.on("live", (...args: any) => {
		console.log("hello from live...................................................");
		console.log(args[0]);
		if (args[0]) {
			let allgames = args[0];
			setEasyGames(allgames.easy);
			setHardGames(allgames.hard);
		}
	});

	socket.on("ballPos", (_data: string) => {
		// console.log('TRIGGERED', { _data });
		canvas = document.getElementById('canvas');
		let array1 = _data.split(' ');
		p1 = array1[0];
		p2 = array1[1];
		game.ball.x = Number(array1[2]);
		game.ball.y = Number(array1[3]);
		game.player1.score = Number(array1[4]);
		game.player2.score = Number(array1[5]);
		if (array1[8] == p2)
			game.player2.y = Number(array1[9]);
		else if (array1[8] == p1)
			game.player1.y = Number(array1[9]);

		// console.log(game);
		drawGame();

	});

	// socket.on("getPlayer", (_data: string) => {
	// 	console.log("getPlayer");

	// 	let array0 = _data.split(' ');

	// 	if (array0[0] == p2)
	// 		game.player2.y = Number(array0[1]);
	// 	else if (array0[0] == p1)
	// 		game.player1.y = Number(array0[1]);

	// 	// game.player1.y = Number(array0[0]);
	// 	// game.player2.y = Number(array0[1]);
	// });

	useEffect(() => {
		canvas = document.getElementById('canvas');
		initilizeGame();
		drawGame();
	}, [])

	return (
		<>
			<div className="homepage w-full h-screen min-w-full relative">
				<img src="/profile/bg.png" className="  w-full h-full min-w-full " alt="" />
				<div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] ">
				</div>
				<div className="contain absolute top-0 w-full h-screen flex justify-between">
					<Sidebar />
					<div className="contentss w-full  h-screen py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
						<Useravatar avata={"/profile/Avatar.png"} userid={"amine ajdahim"} />
						<div>
							<div ><button onClick={() => ft()}>live</button><br />
								{/* <button onClick={() => ft1()}>test</button><br /> */}
								<button onClick={() => ft2()}>clear</button></div>

							<div className=" background-color: coral  width: 200px overflow-y: scroll">
								<div id="livegames">
									{
										easyGames.map((elm: any, index: number) =>
											elm ?
												<button onClick={() => join("Easy", index)} className="w-[100%]">
													<div className="resultplayers   w-[100%]  flex justify-center ">
														<div className="justcenter flex justify-between items-center rounded-[20px] w-[80%] h-[110px] px-7 bg-[#49367c] my-5 bg-opacity-90">
															<div className="player1 flex items-center justify-between w-[50%] ">
																<div className="avatarwithuser flex items-center">
																	<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
																		<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
																	</div>
																	<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{elm.left.username}</div>
																</div>
																<div className="resultnum">
																</div>

															</div>
															<div className="vs text-[#bdb6d0] text-[19px] font-bold  px-4">VS</div>
															<div className="player2 flex items-center justify-between w-[50%]">
																<div className="resultnum">
																</div>
																<div className="avatarwithuser flex items-center">
																	<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{elm.right.username}</div>
																	<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
																		<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
																	</div>
																</div>
															</div>
														</div>
													</div>
												</button>
												: null)
									}
									{
										hardGames.map((elm: any, index: number) =>
											elm ?
												<button onClick={() => join("Hard", index)} className="w-[100%]">

													<div className="resultplayers   w-[100%]  flex justify-center ">
														<div className="justcenter flex justify-between items-center rounded-[20px] w-[80%] h-[110px] px-7 bg-[#f0272074] my-5 bg-opacity-90">
															<div className="player1 flex items-center justify-between w-[50%] ">
																<div className="avatarwithuser flex items-center">
																	<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
																		<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
																	</div>
																	<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{elm.left.username}</div>
																</div>
																<div className="resultnum">
																</div>

															</div>
															<div className="vs text-[#bdb6d0] text-[19px] font-bold  px-4">VS</div>
															<div className="player2 flex items-center justify-between w-[50%]">
																<div className="resultnum">
																</div>
																<div className="avatarwithuser flex items-center">
																	<div className="uername text-[#bdb6d0] text-[19px] font-bold  px-4">{elm.right.username}</div>
																	<div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
																		<img src={"/profile/Avatar.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
																	</div>
																</div>
															</div>
														</div>
													</div>
												</button>
												: null)}
								</div>
							</div>
							<canvas className={style.canvas} id="canvas" width={600} height={600}></canvas>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default live;