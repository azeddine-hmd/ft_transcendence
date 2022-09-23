import Head from 'next/head';
import Image from 'next/image'
import { useState } from 'react';
import profilePic from "../../styles/avatar.png"
import style from "../../styles/app/User_matches.module.css"


export default function User_matches({user, imageUrl, isopen} :any) {
    const [username,setusername] = useState('samurai');
    const todos = [
        { id: 1, user1: "Samurai",user2:"majdahim",imguser1:profilePic,imguser2:profilePic ,results:"5:2" },
        { id: 2, user1: "Samurai",user2:"majdahim",imguser1:profilePic,imguser2:profilePic ,results:"5:2" },
        { id: 3, user1: "Samurai",user2:"majdahim",imguser1:profilePic,imguser2:profilePic ,results:"5:2" }
      ];
    return (
        <>
        <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Alumni+Sans+Collegiate+One&family=Snippet&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Langar&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Serif:opsz@8..144&display=swap" rel="stylesheet"/>
        </Head>
            <div className="allinfo grow flex justify-center my-28">
                <div className={`infouser w-[290px] shadow-2xl h-16 rounded-3xl bg-white relative ${style.infouser}`}>
                    <div className="avatar absolute left-[-10px] top-[-5px] ">
                        <Image src={profilePic} width={80} height={70} className={` rounded-full  `} />
                    </div>
                    <div className="username flex h-full justify-between  mx-[80px] items-center ">
                        <span  className={`text-[30px] relative ${style.hi}`}>hi,</span>
                        <span className={`text-[30px] p-4 ${style.username}`}>{user}</span>
                    </div>
                    <div className="last_matches flex justify-center my-[90px]">
                        <div className="title">
                            <h1 className={`text-[36px] ${style.last_matches1}`}  style={{color:isopen?"#fff":"#087E8B"}} >Last<span className='px-2'>Matches</span></h1>
                        </div>
                    </div>
                    <div className="lstmatches">
                    {todos.map((todo) => (
                        <div key={todo.id} className={` w-[400px] h-[180px] bg-slate-600 p-6 relative right-12 rounded-3xl flex justify-between px-12 items-center mb-8 ${style.allcart}`} style={{background:"#087E8B"}}>
                        <div className="userone flex justify-start flex-col w-[60px]">
                            <Image src={imageUrl} width={70} height={70} className={` rounded-full  `} />
                            <a href="#" className={`text-white pt-4 ${style.userone}`}>{todo.user1}</a>
                        </div>
                        <div className={`userone flex  flex-col w-[60px] relative left-1 ${style.userone}`}>
                            <span className={`text-[40px] text-white`}>5:6</span>
                        </div>
                        <div className="userone flex justify-start flex-col w-[60px]">
                            <Image src={profilePic} width={70} height={70} className={` rounded-full  `} />
                            <a href="#" className={`text-white pt-4  ${style.userone}`}>Samurai</a>
                        </div>
                    </div>
                    ))}
                    </div>
                
                    
                </div>
            </div>
        </>
    );
}
