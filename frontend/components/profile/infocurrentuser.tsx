import styles from "../../styles/Profile/Infouser.module.css"
//Apis
import { Apis } from "../../network/apis";
import {AddFriendDto} from "../../network/dto/payload/add-friend.dto"
import { GameProfile } from "../../network/dto/response/gameprofile.dto";
import { useEffect, useState } from "react";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";

export default function Infouser({ avatar, userid, displayname }: any) {

    const [allinfogame, setallinfogame] = useState<GameProfile>({
        total_games: 0,
        total_wins: 0,
        total_loss: 0,
        percent_pation: 0,
        rank: 0,
        points: 0,
        xp: 0,
        level: 0,
        percent_level: 0,
    });
    useEffect(() => {
        Apis.GetGameprofile({
            onSuccess: (gameprofile: GameProfile) => {
                setallinfogame(gameprofile);
                console.log(gameprofile);
            }, onFailure: (error: ErrorResponse) => {
                console.log(error.message);
            }
        })
    }, [])
    return (
        <div className="level_info w-full h-full flex justify-center ">
            <div className={`backg w-[95%] xl:w-[75%] rounded-tl-[60px]  rounded-br-[60px] md:rounded-r-[18px] bg-opacity-30 flex justify-center  ${styles.userlevelinfo}`}>
                <div className="info flex flex-col md:flex-row  w-full py-2 h-full lg:items-center">
                    <div className={`userinfo lg:w-[50%] xl:w-[50%] md:w-[50%] py-5 sm:py-12  md:py-16 flex justify-start my-1 items-center px-3 lg:px-7 h-[90%]  bg-[#f4d47d] md:rounded-bl-[18px] rounded-tl-[50px] mx-4 md:rounded-r-[18px] ${styles.userinfo}`}>
                        <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                            <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                        </div>
                        <div className="displayname    px-4 flex flex-col">
                            <h1 className="text-[#3b2b60] sm:text-[20px] lg:text-[26px] font-bold ">{displayname}</h1>
                            <div className="username bg   bg-[#ebae3f] flex justify-center rounded-[20px]">
                                <h1 className="font-bold  text-[rgb(255,255,255)]">{userid}</h1>
                            </div>
                        </div>
                    </div>
                    <div className={`userinfo  xl:w-[50%] lg:w-[50%] md:w-[50%] h-[90%] py-5 sm:py-12 md:py-16   flex justify-start my-1 items-center px-3 lg:px-7  bg-[#f4d47d] mx-4 rounded-br-[50px] md:rounded-br-[18px] md:rounded-tr-[80px] md:rounded-l-[18px]`}>
                        <div className="avatar rounded-[50%] relative sm:w-[80px] sm:h-[80px] h-[50px] w-[50px] flex justify-center items-center bg-[#453176] ">
                            <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[100px] min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                        </div>

                        <div className="displayname w-full px-4 flex flex-col">
                            <h1 className="text-[#3b2b60] sm:text-[23px] lg:text-[26px] font-bold flex "><p className=" space-x-5 mr-6"> Level</p> { allinfogame.level}</h1>
                            <h2 className="text-[#3b2b60]  sm:text-[21px]  bottom-2 font-light ">Congrats! You are intermediate now</h2>
                            <div className="w-full bg-[#fae1a1] rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{ width: `${allinfogame.percent_pation}` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

