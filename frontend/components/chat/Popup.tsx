import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {socket} from '../../pages/chat/[chat]'


export default function Popup() {

    const [username, setUsername] = useState('');
    const [username2, setUsername2] = useState('');
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        socket.on('showPopup', ({isInvited , user1, user2}) => {
            
            
            setUsername(user1);
            setUsername2(user2);
            setVisibility(isInvited);
        })
        return () => { socket.off('showPopup'); };
    }, [])

    const r = useRouter();

    function Accept() {
        console.log('inviteAccepted', username);
        socket.emit('inviteAccepted', {username:username})
        setVisibility(false);
        r.push('/game');
    }
    
    function Cancel() {
        setVisibility(false);
    }

    return (
        <>
            {
            (visibility)
            ?
            <div className="popup absolute justify-center  z-50 w-full items-center h-full flex  ">
                <div className="bgopaci absolute top-0 left-0 w-full h-full  min-w-full bg-opacity-95  bg-[#463573] " onClick={() => console.log("close")}></div>
                <div className="popupsettings absolute z-10 bg-white w-[85%] sm:w-[75%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[600px] h-[50%] rounded-[18px]">
                    <div className="closebtn w-full flex justify-end p-8">
                        <button className="text-[23px]  flex justify-end text-[#000] w-[30px] " onClick={() => console.log("close")}><img src="/profile/popup/exit.png" alt="" /></button>
                    </div>
                    <div className="avatar flex relative bottom-10  h-full rounded-[18px] flex-col items-center w-full ">
                        <h6 style={{"fontSize":"22px", "fontWeight":"bold"}}>This user is inviting you to a game</h6>
                        <h6 style={{"fontSize":"18px", "fontWeight":"lighter"}}>{username}</h6>
                        <div className="bbb w-full h-[50%] flex justify-center items-center  ">
                            <div className="imge w-[90%] h-[90%] flex justify-center items-center rounded-[20px] bg-[#463573]" >
                                <img src="/logo.png" className=" w-[80%] h-[80%]"></img>
                            </div>
                        </div>
                            <div className="brns w-full h-[20%] flex  px-16 items-center">
                                <div className="btn w-full h-[2%] flex items-center  justify-around">
                                <button onClick={Accept} className="text-[#fff] bg-[#f18701] py-1 px-4 rounded-[18px] flex items-center"> <img src="/profile/match played.png" className="w-[30%]" alt="" /> <p className="mx-2 font-bold text-[20px]">
                                    Accept</p></button>
                                <button onClick={Cancel} className="text-[#fff] bg-[#ec3e2e] py-3 px-4 rounded-[18px] flex items-center"> <img src="/profile/loses.png" className="w-[50%]" alt="" /> <p className="mx-2 font-bold text-[20px]">
                                    Cancel</p></button>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            :
            <></>
            }
        </>
    );
}