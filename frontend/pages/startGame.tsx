import style from '../styles/game/gameStyle.module.css';
import Sidebar from '../components/profile/Sidebar';
import Useravatar from '../components/profile/Useravatar';
import React from "react";

let url = "http://localhost:3000";

function Game()
{
	const changeStyle = (e: any) => {    
        e.preventDefault();
		if(window.top)
        	window.top.location = url.concat("/game")
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
							<p className={style.p1}>S</p>
							<p className={style.p2}>T</p>
							<p className={style.p3}>A</p>
							<p className={style.p4}>R</p>
							<p className={style.p5}>T</p>
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

