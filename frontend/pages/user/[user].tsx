import ProfileM from "../../components/profile/Profilem";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/profile/Sidebar";
import { Apis } from "../../network/apis";
import { ProfileResponse } from "../../network/dto/response/profile-response.dto";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import Useravatar from "../../components/profile/Useravatar";
import Infouser from "../../components/profile/Infouser";
import Link from "next/link";
import styles from "../../styles/Profile/user.module.css"
import Overview from "../../components/profile/overview";

export default function user(){
        const router = useRouter();
        const userid = router.query.user;
         const [isopen, setisopen] = useState(false);
         const [username, setusername] = useState('')
         const [displayname, setdisplayname] = useState('')
         const [avatar,setavatar] = useState("");
         const [view_history, setview_history] = useState(false);

         useEffect(() => {
                 Apis.CurrentProfile(
                     {
                         onSuccess: (profile:ProfileResponse)=>{
                             setusername(profile.username);
                             setdisplayname(profile.displayName)
                             setavatar("/profile/Avatar.png");
                             
                         },
                         onFailure:(error:ErrorResponse) =>{
                             console.log(error.message)
                         }
                     }
                 )
                 
         },[])

        return (
            <>
            <div className="b w-full  absolute h-screen min-w-full ">
                <img src="/profile/bg.png" className="absolute  w-full h-full min-w-full " alt="" />
                <div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
                <div className="contain absolute top-0 w-full h-screen flex justify-between">
                    <Sidebar/>
                    <div className="contentss w-full  h-screen py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
                        <Useravatar avata={avatar} userid={"amine ajdahim"} />
                        <br />
                        <Infouser avatar={avatar} userid={userid}/>
                        <br />
                        <br />
                        <div className="infogame relative h-[600px] w-full ">
                            <div className="overlay rounded-[30px] h-[600px]  w-full relative opacity-50 bg-[#3d2c6bbe]"></div>
                            <div className="allbtn absolute top-0 w-full h-[95px] flex items-center ">
                            <div className="overlay relative rounded-[30px]  top-0 w-full h-[95px] flex items-center opacity-50 bg-[#644dad]"></div>
                                <div className="menu absolute w-full px-8 flex justify-between">
                                    <div className="firstbtn flex">
                                        <Link href={"/user/majdahim/#"}><h1 onClick={() => setview_history(false)} style={{background:view_history?"#5d48a3db":"#705bb1"}} className="text-[25px] font-bold w-[240px]  py-4 rounded-[19px] bg-[#705bb1] text-[#cec0fb] flex justify-center  cursor-pointer">Overview</h1></Link>
                                        <Link href={"/user/majdahim/#"}><h1 onClick={() => setview_history(true)} style={{background:view_history?"#705bb1":"#5d48a3db"}} className="text-[25px] font-bold w-[240px] mx-3 py-4 rounded-[19px] bg-[#5d48a3db] text-[#cec0fb] flex justify-center  cursor-pointer">Match History</h1></Link>
                                    </div>
                                <Link href={"/user/majdahim/#"} className={``}><h1 className={`text-[25px] font-bold w-[220px] mx-3 py-4 rounded-[19px] bg-[#5d48a3db] text-[#3f2d70] flex justify-center  cursor-pointer ${styles.btnsettings} `}>Settings</h1></Link>
                                </div>
                            </div>
                            {view_history ? null :<Overview/>}
                            
                        </div>
                    </div>
                </div>
            </div>    
            </>      
        )

}
