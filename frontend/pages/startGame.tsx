import style from '../styles/game/gameStyle.module.css';
import Sidebar from '../components/profile/Sidebar';
import Useravatar from '../components/profile/Useravatar';
import React from "react";
import { Router, useRouter } from 'next/router';

let url = "http://localhost:3000";

function Game()
{
	const router = useRouter()
	const changeStyle = (e: any) => {    
        e.preventDefault();
		router.push('/game')
    }
	const live = (e: any) => {    
        e.preventDefault();
		router.push('/live')
    }
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
						<div className={style.start}>							
						 <button onClick={live}>live</button>

						<div className={style.wrapper}>
						<div className={style.left_wall}></div>
						<div className={style.ball}></div>
						<div className={style.right_wall}></div>
						<div className={style.clear}></div>
						</div>
  							<div className={style.cont}>
  							<button className={style.button} onClick={changeStyle}>
							<div className={style.line}></div>
							<div className={style.text}>
							<p className={style.p1}>P</p>
							<p className={style.p2}>L</p>
							<p className={style.p3}>A</p>
							<p className={style.p4}>Y</p>
     						 </div>
							 </button>
       						</div>
						</div>
						</div>
						</div>
						</div>
    		
	</>
    );
}
export default Game;

