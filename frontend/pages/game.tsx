import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import Sidebar from "../components/profile/Sidebar";
import Useravatar from "../components/profile/Useravatar";
import { Apis } from "../network/apis";
import { ErrorResponse } from "../network/dto/response/error-response.dto";
import { ProfileResponse } from "../network/dto/response/profile-response.dto";
import Popup from "../components/popup";

export default function Game() {
    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();
    const [avatar,setavatar] = useState("");

    useEffect(() => {
        Apis.CurrentProfile({
            onSuccess: (userResponse: ProfileResponse) => {
                console.log(userResponse);
                setUsername(userResponse.username);
                setImageUrl(userResponse.avatar);
                console.log(userResponse.avatar);
                setavatar(userResponse.avatar);
                userResponse.username;
            },
            onFailure: (err: ErrorResponse) => {
                if (err.statusCode === 401) {
                    router.push("/signin");
                }
            },
        });
    }), [router];

    return (
        <>
            <div className="homepage overflow-y-scroll h-full w-full  min-w-full relative">
            <img
        src="/profile/bg.png"
        className="  w-full h-screen min-w-full "
        alt=""
      />
                <div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
                <div className="contain absolute top-0 w-full h-full flex justify-between">
                <div className="si xl:flex relative lg:hidden md:hidden z-60  sm:hidden hidden" >
                <Sidebar/>
                
            </div>
                        {/* <Popup/> */}
                    <div className="contentss w-full  h-full py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
                        <Useravatar
                            avata={imageUrl}
                            userid={username}
                        />
                        {/* <h1>data</h1> */}
                        <div className="resultplayers  bg-[#49367c] my-5 bg-opacity-90 w-[100%] h-[110px] rounded-[20px] flex justify-between items-center px-7 ">
                                    <div className="player1 flex items-center justify-between w-[50%] ">
                                        <div className="avatarwithuser flex items-center">
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                            </div>
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{"samurai"}</div>
                                        </div>
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{0}</div>
                                        </div>

                                    </div>
                                    <div className="vs text-[#9681d5] text-[19px] font-bold  px-4">VS</div>
                                    <div className="player2 flex items-center justify-between w-[50%]">
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{0}</div>
                                        </div>
                                        <div className="avatarwithuser flex items-center">
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{"samurai"}</div>
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    </div>
                </div>
            </div>
        </>
    );
}
