import { useState } from "react";

export default function Popup({msg} :any){
    const [open,setopen] = useState(true);
    return (
        <>
        {open?<div className="popup absolute justify-center  z-50 w-full items-center h-full flex  ">
                            <div className="bgopaci absolute top-0 left-0 w-full h-full  min-w-full bg-opacity-95  bg-[#463573] " onClick={() => console.log("close")}></div>
                            <div className="popupsettings absolute z-10 bg-white w-[50%] sm:w-[75%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[600px] h-[50%] rounded-[18px]">
                                <div className="closebtn w-full flex justify-end p-8">
                                    <button className="text-[23px]  flex justify-end text-[#000] w-[30px] " onClick={() => setopen(!open)} ><img src="/profile/popup/exit.png" alt="" /></button>
                                </div>
                                <div className="avatar flex relative bottom-10 justify-center flex-col items-center w-full ">
                                    <h1>{msg}</h1>
                                     
                                </div>
                            </div>
                        </div>: null
        }
        
        </>
    );
}