import { useEffect } from "react";
import styles from "../../styles/Profile/overview.module.css";
import { Apis } from "../../network/apis";

export default function MatchHistory({listFreinds,avatar}: any) {


    useEffect(() => {
        Apis.getFriends({onSuccess : () =>{}, onFailure: () =>{}})
        
    }, )

    return (
        <div className="over w-full h-full rounded-[20px] flex justify-center items-center bg-opacity-50 bg-[#3d2c6bbe]">

                            <div className="scrool w-[90%] h-[600px] overflow-y-scroll  bg-[#624c9e] bg-opacity-50 rounded-[20px] ">

                            <div className={` flex justify-center py-6 flex-col  m-auto items-center  min-w-[700px]  ${styles.scrollbar}  `}>
                            {listFreinds.map((item:any, index:any) => {return(<>
                                <div className={`resultplayers  my-1 bg-[#49367c] bg-opacity-90 w-[90%] h-[110px] rounded-[20px] flex justify-between items-center px-7  min-w-[650px] `}>
                                    <div className="player1 flex items-center justify-between w-[50%] ">
                                        <div className="avatarwithuser flex items-center">
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                            </div>
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{item.user}</div>
                                        </div>
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{item.resultmtch}</div>
                                        </div>

                                    </div>
                                    <div className="vs text-[#9681d5] text-[19px] font-bold  px-4">VS</div>
                                    <div className="player2 flex items-center justify-between w-[50%]">
                                        <div className="resultnum">
                                            <div className="resultnum1 text-[#cfc0fb] text-[35px] font-bold  px-4">{item.resultmtch}</div>
                                        </div>
                                        <div className="avatarwithuser flex items-center">
                                            <div className="uername text-[#9681d5] text-[19px] font-bold  px-4">{item.user}</div>
                                            <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                                <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
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