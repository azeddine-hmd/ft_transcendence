import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Profile/Sidebar.module.css"
import Link from "next/link";
import { Apis } from '../../network/apis'
import { profile } from "console";
import Profile from "../../pages/profile";
import { ProfileResponse } from "../../network/dto/response/profile-response.dto";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
// import { styles } from "@mui/system";



export default function Sidebar() {
    
    const router = useRouter();
    const [username, setusername] = useState('')

    useEffect(() => {
            Apis.CurrentProfile(
                {
                    onSuccess: (profile:ProfileResponse)=>{
                        setusername(profile.username);
                    },
                    onFailure:(error:ErrorResponse) =>{
                        console.log(error.message)
                    }
                }
            )
            
    },[])

    const MenuItems = [
        {
          label: 'Profile',
          url: "/user/profile",
          icon: "/profile/Profile user.png",
          active: false,
        },
        {
          label: 'Chat',
          url: "/chat/0",
          icon: "/profile/chat.png",
          active: false,
        },
        
       {
          label: 'Game',
          url: "/startGame",
          icon: "/profile/level.png",
          active: true,
        },
        {
            label: 'Live',
            url: "/live",
            icon: "/profile/level.png",
            active: true,
          },
      ];

    return (
            <div className={`background_sidebar relative z-30  w-[350px] h-full ${styles.background_sidebar}`}>
                <div className="load  ">
                <div className="menu my-20 flex w-full justify-center">
                        <img src="/profile/LOGO.png" alt="sdfsdfsf" />
                    </div>
                {MenuItems.map((item,index) => {
                    // console.log(item.url);
                    return (<>
                    <Link href={item.url} key={index}>
                    <div className="lis flex w-full justify-center flex-col items-center ">
                        <div className={`menu flex w-full cursor-pointer h-[45px] right-8 relative justify-center my-4  items-center ${
                    router.asPath === item.url
                        ? styles.hoverss
                        : null
                    } `}>
                            <div className="icons flex  relative right-3">
                                <img src={item.icon} className={`${router.asPath === item.url? styles.changecolorimg: styles.colorimg} relative top-1 w-[27px] h-[28px]`} alt="" />
                                <h1 className={`relative top-1 left-1 text-[23px] font-semibold text-[#fff] ${router.asPath === item.url? styles.changecolorimg: styles.colorimg}`}>{item.label}</h1>
                            </div>
                            {/* {item.label} */}

                        </div>
                    </div>
                    </Link>
                    </>)
                })}


                </div>
                
            </div>
    );
}