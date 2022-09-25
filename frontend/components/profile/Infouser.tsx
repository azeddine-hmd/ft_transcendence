import styles from "../../styles/Profile/Infouser.module.css"
export default function Infouser({avatar,userid}:any){
    return(
        <div className={`level_info h-[250px] w-full flex justify-between items-center   ${styles.userlevelinfo}`}>
                <div className={`userinfo relative w-[50%] min-w-[450px] flex justify-start  items-center px-10 h-[75%] bg-[#f4d47d] mx-6 ${styles.userinfo}`}>
                    <div className="avatar rounded-[50%] relative min-w-[110px] h-[110px] w-[110px] flex justify-center items-center bg-[#453176] ">
                        <img src={avatar} className={`rounded-[50%] w-[100px] relative bottom-[2px] `} alt="" />
                    </div>
                    <div className="displayname relative   px-4 flex flex-col">
                        <h1 className="text-[#3b2b60] font-bold text-[32px]">Amine Ajdahim</h1>
                        <div className="username relative bg-[#ebae3f] flex justify-center rounded-[20px]">
                            <h1 className="font-bold text-[23px] text-[rgb(255,255,255)]">{userid}</h1>
                        </div>
                    </div>
                </div>
                <div className={`level relative w-[50%] min-w-[450px] flex justify-start  items-center px-10 h-[75%] bg-[#f0c45d] mx-6 ${styles.userlevel} `}>
                    <div className="avatar  relative min-w-[110px] h-[110px] w-[110px] flex justify-center items-center ">
                            <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[100px] relative bottom-[2px] `} alt="" />
                        </div>
                        <div className="displayname w-full relative   px-4 flex flex-col">
                            <h1 className="text-[#3b2b60] font-bold text-[32px]">Level 20</h1>
                            <h2 className="text-[#3b2b60] font-light text-[15px]">Congrats! You're intermediate now</h2>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{width: "45%"}}></div>
                            </div>
                        </div>
                    


                </div>
        </div>
    );
}