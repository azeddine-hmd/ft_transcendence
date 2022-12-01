import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import { ProfileResponse } from "../../network/dto/response/profile-response.dto";
import styles from "../../styles/Profile/Useravatar.module.css";
import { Apis } from "../../network/apis";

export default function Useravatar() {
  const [open, setopen] = useState(false);
  const [userid, setuserid] = useState("");
  const [avatar, setavatar] = useState("");
  const [currnetdispayname, setcurrnetdispayname] = useState("");
  const [onlinestatus,setOnlinestatus] = useState(true);

  useEffect(() => {
    Apis.CurrentProfile(
        {
            onSuccess: (profile: ProfileResponse) => {
                setcurrnetdispayname(profile.displayName);
                setavatar(profile.avatar);
                //  setavatar("/profile/Avatar.png");
            },
            onFailure: (error: ErrorResponse) => {
                console.log(error.message)
            }
        }
    )
}, [])

  return (
    <div className="iconuser  relative flex  justify-end  ">
      <div className="bgopaci relative w-[250px] h-[70px] flex  items-center rounded-[16px] opacity-70 cursor-pointer bg-[#705bb1] "></div>
      <div
        className={`user absolute w-[250px] h-[70px] flex  items-center rounded-[16px]  cursor-pointer ${styles.shadows}`}
        onClick={() => setopen(!open)}
      >
        <div className="elauser  w-full flex px-2 pr-3 items-center justify-center">
          <div className="avataru flex items-center ">
            <div className="a w-[52px] min-w-[48px]">
              <div className="image relative flex">
              <img src={avatar} className={`rounded-[50%] shadow-2xl`} alt="" />
              {onlinestatus? <div className="dot h-[15px] w-[15px] bg-emerald-500 rounded-[50%] flex z-60 absolute right-0 top-8 "></div>:
               <div className="dot h-[15px] w-[15px] bg-slate-400 rounded-[50%] flex z-60 absolute right-0 top-8 "></div>
               }
              </div>
            </div>
            <h1 className="text-[#fff] px-3">{currnetdispayname}</h1>
          </div>
          <div className="selec">
            <img
              src="/profile/Menu Button.png"
              className="w-[22px] cursor-pointer"
              alt=""
            />
          </div>
        </div>
      </div>
      {open ? (
        <div
          className={`dropdown absolute z-10 w-[220px] h-[80px] rounded-[18px] flex items-center flex-col mt-[75px] bg-white ${styles.dropdown} `}
        >
          <div className="buttonsetting w-full h-full flex overflow-hidden flex-col justify-center">
            <Link href={"/user/profile"}>
              <p className="w-full h-[50%] relative rounded-t-[18px] bg-[#e2daf6] text-[#392763] cursor-pointer overflow-hidden flex justify-center items-center">
                My Account
              </p>
            </Link>
            <Link href={"/logout"}>
              <p className="w-full h-[50%] relative rounded-b-[18px] bg-[#e2daf6] text-[#392763]  cursor-pointer overflow-hidden flex justify-center items-center">
                Log out
              </p>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
