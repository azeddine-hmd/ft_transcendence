import MatchHistory from "./match_history";
import styles from "../../styles/Profile/overview.module.css";


export default function Overview({RecentGame,avatar}: any) {
    return (

        <div className="over w-full h-full rounded-[20px] flex justify-center items-center bg-opacity-50 bg-[#3d2c6bbe] ">

            <div className="scrool w-[95%]  bg-opacity-50 rounded-[20px]  ">

                    <div className={`scrools flex justify-start sm:justify-center overflow-y-auto ${styles.scrollbar} `}>
                <div className={` flex justify-center bg-[#624c9e] h-[100px] rounded-[20px] px-4  items-center min-w-[800px] sm:w-full  `}>
                        <div className="matchplayed flex bg-[#3d2c6bbe] p-1 rounded-[20px] grow items-center h-[70px] justify-center">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium px-4">Match Played</div>
                            <img src="/profile/match played.png" className="w-[30px] mx-4" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">100</div>
                        </div>
                        {/* pip */}
                        <h1 className="text-[#fff] px-1 after:content-['|']"></h1>
                        <div className="matchplayed flex items-center bg-[#3d2c6bbe] p-2 h-[80px] rounded-[20px] grow justify-center ">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium  px-4">Wins:</div>
                            <img src="/profile/cupwin.png" className="w-[30px]  relative top-1 h-[25px] mx-2" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">100</div>
                        </div>
                        <h1 className="text-[#fff] px-1 after:content-['|']"  ></h1>
                        <div className="matchplayed flex bg-[#3d2c6bbe] p-2 rounded-[20px] h-[80px] grow items-center justify-center ">
                            <div className="matchplayed1 text-[#ffffff] text-[22px] font-medium  px-4">Loses:</div>
                            <img src="/profile/loses.png" className="w-[30px]  relative top-2 h-[25px] mx-2" alt="" />
                            <div className="matchplayed2 text-[#ffffff] text-[22px]  px-4">100</div>
                        </div>

                    </div>
                </div>
                <div className={` flex justify-start bg-[#624c9e] h-[230px] my-9 rounded-[20px] py-6  px-9 m-auto flex-col min-w-[300px] overflow-y-scroll ${styles.scrollbar}  `}>
                        <p className="text-[22px] text-[#fff] font-medium ">Recent Game</p>
                        {RecentGame.map((item:any, index:any) => {return(<>
                                <div className="resultplayers  bg-[#49367c] my-5 bg-opacity-90 w-[100%] h-[110px] rounded-[20px] flex justify-between items-center px-7 min-w-[700px]">
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



    //     <>
    //     <div className="result absolute top-32 mt-5 w-full h-[95px]  justify-center items-center min-w-[900px] sm:flex  border border-red-300">
    //                             <div className="centerel absolute w-[90%] rounded-[20px]  h-[95px] flex justify-center items-center">
    //                                 <div className="overlay relative rounded-[30px]  top-0 w-full h-[95px] flex opacity-50 bg-[#644dad]"></div>
    //                                 <div className="icons absolute flex justify-around w-full px-8 ">
    //                                         <div className="playmtches w-[340px]  py-3 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center items-center  cursor-pointer">
    //                                             <h1 className="text-[25px] font-bold ">Match Played</h1>
    //                                             <img src="/profile/match played.png" className="w-[30px] mx-4" alt="" />
    //                                             <p className="mr-3 text-[25px] font-bold">{11}</p>
    //                                         </div>
    //                                          <h1 className="text-[#fff]">|</h1>
    //                                         <div className="wins w-[210px]  py-4 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
    //                                             <h1 className="text-[25px] font-bold ">Wins:</h1>
    //                                             <img src="/profile/cupwin.png" className="w-[30px]  relative top-1 h-[25px] mx-2" alt="" />
    //                                             <p className="mr-2 text-[25px] font-bold">{9}</p>
    //                                         </div>
    //                                          <h1 className="text-[#fff]">|</h1>
    //                                         <div className="loses w-[210px]  py-4 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
    //                                             <h1 className="text-[25px] font-bold">Loses:</h1>
    //                                             <img src="/profile/loses.png" className="w-[30px]  relative top-2 h-[25px] mx-2" alt="" />
    //                                             <p className="mr-2 text-[25px] font-bold">{2}</p>
    //                                         </div>
    //                                 </div>
    //                                 {/* Recent game */}
    //                             </div>
                                
    //                         </div>
    //                         <br />
    //                         <br />
    //                         <div className="recentgame absolute top-[240px] mt-5 w-full h-[300px] flex justify-center items-center min-w-[900px] border border-red-300 ">
    //                             <div className="centerel absolute w-[90%] rounded-[20px] items-center  h-[300px] flex ">
    //                                 <div className="overlay relative rounded-[30px]  top-0 w-full h-[300px] flex opacity-50 bg-[#644dad]"></div>
    //                                 <div className="icons absolute flex justify-start items-start flex-col w-full px-8 ">
    //                                     <div className="loses w-[310px]  py-3 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
    //                                         <h1 className="text-[25px] font-bold">Recent Game</h1>
    //                                     </div>
    //                                     <div className="loses w-[310px] my-2 py-4 rounded-[24px] text-[#ffffff] flex justify-center cursor-pointer">
    //                                         <img src="/profile/level.png" className={`w-[25px] h-[25px] relative top-1 mx-2`} alt="" />
    //                                         <h1 className="text-[25px] font-bold">No Game Found</h1>
    //                                     </div>
    //                                 </div>

    //                             </div>
    //                         </div>
    //     </>
    );
}