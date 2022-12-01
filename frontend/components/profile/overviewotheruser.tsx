import MatchHistory from "./match_history";
import styles from "../../styles/Profile/overview.module.css";
import { useEffect, useState } from "react";
import { Apis } from "../../network/apis";
import { GameProfile } from "../../network/dto/response/gameprofile.dto";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import { ResultuserGame } from "../../network/dto/response/resultgameuser.dto";
import { ProfilesUser } from "../../network/dto/payload/profileuser";
import { useRouter } from "next/router";
import { localService } from "../../network/local.service";


export default function Overview({RecentGame,avatar}: any) {
    const router = useRouter();
    const userid = router.query.user;
    const [allinfogame, setallinfogame] = useState<GameProfile>();
    useEffect(() => {
        if (userid) {
           
            console.log("samurai was here " +userid);
            localService.get<GameProfile>(`/api/games/username/${userid}`).then((res )=> {
                setallinfogame(res.data);
                console.log(res.data);
            }).catch((err) => {
                alert(err.message);
            });
        }
        // if(username)
            // console.log("other user : " + username);

        
    }, [userid])
        


    return (

        <div className="over w-full h-full rounded-[20px] flex justify-center items-center bg-opacity-50 bg-[#3d2c6bbe] ">

            <div className="scrool w-[95%]  bg-opacity-50 rounded-[20px]  ">

                    <div className={`scrools flex justify-start sm:justify-center overflow-y-auto ${styles.scrollbar} `}>
                <div className={` flex justify-center bg-[#624c9e] h-[100px] rounded-[20px] px-4  items-center min-w-[800px] sm:w-full  `}>
                        <div className="matchplayed flex bg-[#3d2c6bbe] p-1 rounded-[20px] grow items-center h-[70px] justify-center">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium px-4">Match Played</div>
                            <img src="/profile/match played.png" className="w-[30px] mx-4" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">{allinfogame?.total_games}</div>
                        </div>
                        {/* pip */}
                        <h1 className="text-[#fff] px-1 after:content-['|']"></h1>
                        <div className="matchplayed flex items-center bg-[#3d2c6bbe] p-2 h-[80px] rounded-[20px] grow justify-center ">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium  px-4">Wins:</div>
                            <img src="/profile/cupwin.png" className="w-[30px]  relative top-1 h-[25px] mx-2" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">{allinfogame?.total_wins}</div>
                        </div>
                        <h1 className="text-[#fff] px-1 after:content-['|']"  ></h1>
                        <div className="matchplayed flex bg-[#3d2c6bbe] p-2 rounded-[20px] h-[80px] grow items-center justify-center ">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium  px-4">Loses:</div>
                            <img src="/profile/loses.png" className="w-[30px]  relative top-2 h-[25px] mx-2" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">{allinfogame?.total_loss}</div>
                        </div>

                    </div>
                </div>
                <div className={` flex justify-start bg-[#624c9e] h-[230px] my-9 rounded-[20px] py-6  px-9 m-auto flex-col min-w-[300px] overflow-y-scroll ${styles.scrollbar}  `}>
                        <p className="text-[22px] text-[#fff] font-medium ">Recent Game</p>
                        {RecentGame.slice(0, 1).map((item:any, index:any) => {return(<>
                                <div key={index} className="resultplayers  bg-[#49367c] my-5 bg-opacity-90 w-[100%] h-[110px] rounded-[20px] flex justify-between items-center px-7 min-w-[700px]">
                                    <div className="player1 flex items-center justify-between w-[50%] ">
                                        <div className="avatarwithuser flex items-center">
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={item.winner.avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                            </div>
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{item.winner.username}</div>
                                        </div>
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{item.winnerScore}</div>
                                        </div>

                                    </div>
                                    <div className="vs text-[#9681d5] text-[19px] font-bold  px-4">VS</div>
                                    <div className="player2 flex items-center justify-between w-[50%]">
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{item.loserScore}</div>
                                        </div>
                                        <div className="avatarwithuser flex items-center">
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{item.loser.username}</div>
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={item.loser.avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>)})}
                </div>
            </div>

        </div>

    );
}