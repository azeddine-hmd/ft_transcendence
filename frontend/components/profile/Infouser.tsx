import styles from "../../styles/Profile/Infouser.module.css"
export default function Infouser({avatar,userid,displayname}:any){
    return(
        <div className="level_info w-full h-full flex justify-center ">
                <div className={`backg w-[95%] xl:w-[75%] rounded-tl-[60px]  rounded-br-[60px] md:rounded-r-[18px]   ${styles.userlevelinfo}`}>
                    <div className="info flex flex-col md:flex-row  w-full py-2 h-full lg:items-center">
                        <div className={`userinfo lg:w-[50%] xl:w-[50%] md:w-[50%] py-5 sm:py-12  md:py-16 flex justify-start my-1 items-center px-3 lg:px-7 h-[90%]  bg-[#f4d47d] md:rounded-bl-[18px] rounded-tl-[50px] mx-4 md:rounded-r-[18px] ${styles.userinfo}`}>
                                <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                    <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                </div>
                                <div className="displayname    px-4 flex flex-col">
                                    <h1 className="text-[#3b2b60] sm:text-[20px] lg:text-[26px] font-bold ">{displayname}</h1>
                                    <div className="username  bg-[#ebae3f] flex justify-center rounded-[20px]">
                                        <h1 className="font-bold  text-[rgb(255,255,255)]">{userid}</h1>
                                    </div>
                                </div>
                        </div>
                        <div className={`userinfo  xl:w-[50%] lg:w-[50%] md:w-[50%] h-[90%] py-5 sm:py-12 md:py-16   flex justify-start my-1 items-center px-3 lg:px-7  bg-[#f4d47d] mx-4 rounded-br-[50px] md:rounded-br-[18px] md:rounded-tr-[80px] md:rounded-l-[18px]`}>
                                <div className="avatar rounded-[50%] relative sm:w-[80px] sm:h-[80px] h-[50px] w-[50px] flex justify-center items-center bg-[#453176] ">
                                    <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[100px] min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                </div>

                                <div className="displayname w-full px-4 flex flex-col">
                                    <h1 className="text-[#3b2b60] sm:text-[23px] lg:text-[26px] font-bold ">Level 20</h1>
                                    <h2 className="text-[#3b2b60]  sm:text-[21px]  bottom-2 font-light ">Congrats! You're intermediate now</h2>
                                    <div className="w-full bg-[#fae1a1] rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{width: "45%"}}></div>
                                    </div>
                            </div>
                                    

                        </div>
                        {/* <div className={`userinfo  xl:w-[50%]  py-8 sm:py-12  flex justify-start my-.5 items-center px-3 h-[75%] bg-[#f4d47d] mx-4 mb-1.5  rounded-br-[50px]`}>
                                <div className="avatar rounded-[50%] relative sm:w-[80px] sm:h-[80px] h-[50px] w-[50px] flex justify-center items-center bg-[#453176] ">
                                    <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] relative bottom-[2px] `} alt="" />
                                </div>
                                <div className="displayname w-full    px-4 flex flex-col">
                                    <h1 className="text-[#3b2b60] font-bold ">Level 20</h1>
                                    <h2 className="text-[#3b2b60]   bottom-2 font-light ">Congrats! You're intermediate now</h2>
                                    <div className="w-full bg-[#fae1a1] rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{width: "45%"}}></div>
                                    </div>
                            </div>
                        </div> */}
                    </div>
                    {/* <div className="info flex flex-col md:flex-row jus">
                        
                    </div> */}
                </div>
                

        </div>
       
    );
}

{/* <div className={`level_info h-[250px] w-[80%]  flex justify-between items-center flex-wrap sm:flex-wrap md:flex-wrap lg:flex-nowrap   ${styles.userlevelinfo}`}>
<div className={`userinfo relative xl:w-[50%]   flex justify-start my-4 items-center px-10 h-[75%] bg-[#f4d47d] mx-6 ${styles.userinfo}`}>
    <div className="avatar rounded-[50%] relative min-w-[110px] h-[110px] w-[110px] flex justify-center items-center bg-[#453176] ">
        <img src={avatar} className={`rounded-[50%] w-[100px] relative bottom-[2px] `} alt="" />
    </div>
    <div className="displayname relative   px-4 flex flex-col">
        <h1 className="text-[#3b2b60] font-bold text-[32px]">{displayname}</h1>
        <div className="username relative bg-[#ebae3f] flex justify-center rounded-[20px]">
            <h1 className="font-bold text-[23px] text-[rgb(255,255,255)]">{userid}</h1>
        </div>
    </div>
</div>
<div className={`level relative xl:w-[50%] w-full flex justify-start  items-center px-10 h-[75%] bg-[#f0c45d] mx-6 ${styles.userlevel} `}>
    <div className="avatar  relative min-w-[110px] h-[110px] w-[110px] flex justify-center items-center ">
            <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[100px] relative bottom-[2px] `} alt="" />
        </div>
        <div className="displayname w-full relative   px-4 flex flex-col">
            <h1 className="text-[#3b2b60] font-bold text-[32px]">Level 20</h1>
            <h2 className="text-[#3b2b60] relative bottom-2 font-light text-[23px]">Congrats! You're intermediate now</h2>
            <div className="w-full bg-[#fae1a1] rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{width: "45%"}}></div>
            </div>
        </div>
    


</div>
</div> */}