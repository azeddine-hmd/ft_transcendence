export default function Overview() {
    return (
        <>
        <div className="result absolute top-32 mt-5 w-full h-[95px]  justify-center items-center min-w-[900px] sm:flex  border border-red-300">
                                <div className="centerel absolute w-[90%] rounded-[20px]  h-[95px] flex justify-center items-center">
                                    <div className="overlay relative rounded-[30px]  top-0 w-full h-[95px] flex opacity-50 bg-[#644dad]"></div>
                                    <div className="icons absolute flex justify-around w-full px-8 ">
                                            <div className="playmtches w-[340px]  py-3 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center items-center  cursor-pointer">
                                                <h1 className="text-[25px] font-bold ">Match Played</h1>
                                                <img src="/profile/match played.png" className="w-[30px] mx-4" alt="" />
                                                <p className="mr-3 text-[25px] font-bold">{11}</p>
                                            </div>
                                             <h1 className="text-[#fff]">|</h1>
                                            <div className="wins w-[210px]  py-4 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
                                                <h1 className="text-[25px] font-bold ">Wins:</h1>
                                                <img src="/profile/cupwin.png" className="w-[30px]  relative top-1 h-[25px] mx-2" alt="" />
                                                <p className="mr-2 text-[25px] font-bold">{9}</p>
                                            </div>
                                             <h1 className="text-[#fff]">|</h1>
                                            <div className="loses w-[210px]  py-4 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
                                                <h1 className="text-[25px] font-bold">Loses:</h1>
                                                <img src="/profile/loses.png" className="w-[30px]  relative top-2 h-[25px] mx-2" alt="" />
                                                <p className="mr-2 text-[25px] font-bold">{2}</p>
                                            </div>
                                    </div>
                                    {/* Recent game */}
                                </div>
                                
                            </div>
                            <br />
                            <br />
                            <div className="recentgame absolute top-[240px] mt-5 w-full h-[300px] flex justify-center items-center min-w-[900px] border border-red-300 ">
                                <div className="centerel absolute w-[90%] rounded-[20px] items-center  h-[300px] flex ">
                                    <div className="overlay relative rounded-[30px]  top-0 w-full h-[300px] flex opacity-50 bg-[#644dad]"></div>
                                    <div className="icons absolute flex justify-start items-start flex-col w-full px-8 ">
                                        <div className="loses w-[310px]  py-3 rounded-[24px] bg-[#443375] text-[#ffffff] flex justify-center cursor-pointer">
                                            <h1 className="text-[25px] font-bold">Recent Game</h1>
                                        </div>
                                        <div className="loses w-[310px] my-2 py-4 rounded-[24px] text-[#ffffff] flex justify-center cursor-pointer">
                                            <img src="/profile/level.png" className={`w-[25px] h-[25px] relative top-1 mx-2`} alt="" />
                                            <h1 className="text-[25px] font-bold">No Game Found</h1>
                                        </div>
                                    </div>

                                </div>
                            </div>
        </>
    );
}