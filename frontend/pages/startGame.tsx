import style from '../styles/game/gameStyle.module.css';
import Sidebar from '../components/profile/Sidebar';
import Useravatar from '../components/profile/Useravatar';
import React from "react";
import { Router, useRouter } from 'next/router';

function Game() {
	const router = useRouter()
	const changeStyle = (e: any) => {
		router.push('/game')
	}

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
						<div className={style.start}>
							<div className={style.wrapper}>
								<div className={style.left_wall}></div>
								<div className={style.ball}></div>
								<div className={style.right_wall}></div>
							</div>
							<div>
							<h1 className=" text-[#e8e04a] text-[30px] mt-10 w-full text-center ">About Pong</h1>
								<p className=" text-[#f8f8f6] text-center mt-10 text-[24px]">
								Pong is one of the first computer games that ever created, this simple tennis like game features two paddles and a ball,
								 the goal is to defeat your opponent by being the first one to gain10 point, a player gets a point once the opponent misses a ball.
								  The game can be played with two human players, or one player against a computer controlled paddle. The game was originally developed
								   by Allan Alcorn and released in 1972 by Atari corporations. Soon, Pong became a huge success, and became the first commercially successful game, on 1975, Atari release a home edition of Pong
								    (the first version was played on Arcade machines) which sold 150,000 units. Today, the Pong Game is considered to be the game which started the video games industry, 
									as it proved that the video games market can produce significant revenues.</p> 
									<h1 className=" text-[#e8e04a] text-center mt-10 text-[30px]">Hou to play</h1>
									<p className=" text-[#f8f8f2] text-center mt-10 text-[24px]">
										Move mouse cursor over the game field to move the racket. Do not allow the ball to hit right side wall
									</p>
									</div>
							<div ><button className="mt-10" onClick={changeStyle}>PLAY</button></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
export default Game;

