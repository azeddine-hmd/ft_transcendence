import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/Profile/Useravatar.module.css"

export default function Useravatar({avata,userid}:any) {
    const [open,setopen] = useState(false);
    return (
        <div className="iconuser  relative flex  justify-end  ">
        <div className="bgopaci relative w-[250px] h-[70px] flex  items-center rounded-[16px] opacity-70 cursor-pointer bg-[#705bb1] "></div>
        <div className={`user absolute w-[250px] h-[70px] flex  items-center rounded-[16px]  cursor-pointer ${styles.shadows}`} onClick={()=>setopen(!open)}>
            <div className="elauser  w-full flex px-2 pr-3 items-center justify-center">
                 <div className="avataru flex items-center ">
                    <div className="a w-[52px] min-w-[48px]">
                        <img src={avata} className={`rounded-[50%] shadow-2xl`}  alt="" />
                    </div>
                    <h1 className="text-[#fff] px-3">{userid}</h1>
                </div>
                <div className="selec">
                    <img src="/profile/Menu Button.png" className="w-[22px] cursor-pointer" alt="" />
                </div>
            </div>
        </div>
        {open ?  <div className={`dropdown absolute z-10 w-[220px] h-[80px] rounded-[18px] flex items-center flex-col mt-[75px] bg-white ${styles.dropdown} `}>
            <div className="buttonsetting w-full h-full flex overflow-hidden flex-col justify-center">
                <Link href={"/user/majdahim/#"}><p className="w-full h-[50%] relative rounded-t-[18px] bg-[#e2daf6] text-[#392763] cursor-pointer overflow-hidden flex justify-center items-center">Account Settings</p></Link>
                <Link href={"/logout"}><p className="w-full h-[50%] relative rounded-b-[18px] bg-[#e2daf6] text-[#392763]  cursor-pointer overflow-hidden flex justify-center items-center">Log out</p></Link>
            </div>
        </div>: null}
       
        </div>
    );
}

