import profilePic from "../../styles/avatar.png"
import Image from "next/image";
import style from "../../styles/Profile/Profilem.module.css"


export default function ProfileM(){
    return (
        <>
       <div className="prnt_profile h-full w-full flex justify-center items-center">
            <div className="profile w-[70%] h-[70%] bg-white rounded-3xl relative">
                    <div className={`imgprofile flex justify-center relative top-[-70px] `}>
                        <div className={` ${style.imgprofile} rounded-full absolute w-[153px] h-[153px]`}></div>
                        <Image className={` ${style.imgprf}`} src={profilePic} width={153} height={153}/>
                    </div>
            </div>
       </div>
        </>
    );
}
