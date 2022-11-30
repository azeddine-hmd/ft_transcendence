import styles from "../../styles/Profile/Infouser.module.css"
//Apis
import { Apis } from "../../network/apis";
import {AddFriendDto} from "../../network/dto/payload/add-friend.dto"
import { useEffect } from "react";
import { localService } from "../../network/local.service";
import { RelationResponse } from "../../network/dto/response/relation-response.dto";
import { useState } from "react";
import { FriendsStatus } from "../../network/dto/response/friends-response.dto";
import { BsTropicalStorm } from "react-icons/bs";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";






export default function Infouser({avatar,userid,displayname,booling}:any){

    const [relation,setRelation] = useState("")
    const [blockstatus,setBlockstatus] = useState("");
    const [onlinestatus,setOnlinestatus] = useState(true);

        console.log("userid :",userid)

    useEffect(() => {
        if(userid)
            getFriendRelation(userid);
    }, [userid])

    function getFriendRelation(userid: string) {
        localService.get<RelationResponse>(`/api/users/relations/username/${userid}`).then((res)=>{
            switch (res.data.friends) {
                case FriendsStatus.Friends:
                    setRelation("Unfriend");
                    break;
                case FriendsStatus.Neutral:
                    setRelation("Add Friend");
                    break;
                case FriendsStatus.Accept:
                    setRelation("Accept Friend");
                    break;
                case FriendsStatus.Pending:
                    setRelation("Friend Pending");
                    break;
            }
            if(res.data.blocked == true)
                setBlockstatus("Unblock");
            else if (res.data.blocked == false)
                setBlockstatus("Block");
            console.log(`friends status: ${res.data.friends} | block status: ${res.data.blocked})}`);
        }).catch((err)=>{
            alert(err.messages);
        })
    }

    function sendFriendRequest(userid: string) {
        Apis.AddFriend({
            addFriendDto: {
                friend_username: userid,
            },
            onSuccess: () => {
                getFriendRelation(userid);
            },
            onFailure: (err: ErrorResponse) => {
                alert(err.message);
            },
        });
    }
    function sendUnfriendRequest(userid: string) {
        Apis.RemoveFriend({
            addFriendDto: {
                friend_username: userid,
            },
            onSuccess: () => {
                getFriendRelation(userid);
            },onFailure: (err: ErrorResponse) => {
                alert(err.message);
            }
        });

    }
    function sendblockRequest(userid: string) {
        localService.post(`/api/users/relations/block`, {
            friend_username: userid,
        }).then((res)=>{
            getFriendRelation(userid);
        }).catch((err)=>{
            alert(err.messages);
        })
    }
    function sendUnblockRequest(userid: string) {
        localService.post(`/api/users/relations/unblock`, {
            friend_username: userid,
        }).then((res)=>{
            getFriendRelation(userid);
        }).catch((err)=>{
            alert(err.messages);
        })
    }

    return(
        <div className="level_info w-full h-full flex justify-center ">
                <div className={`backg w-[95%] xl:w-[75%] rounded-tl-[60px]  rounded-br-[60px] md:rounded-r-[18px] bg-opacity-30 flex justify-center  ${styles.userlevelinfo}`}>
                    <div className="info flex flex-col md:flex-row  w-full py-2 h-full lg:items-center">
                        <div className={`userinfo lg:w-[50%] xl:w-[50%] md:w-[50%] py-5 sm:py-12  md:py-16 flex justify-start my-1 items-center px-3 lg:px-7 h-[90%]  bg-[#f4d47d] md:rounded-bl-[18px] rounded-tl-[50px] mx-4 md:rounded-r-[18px] ${styles.userinfo}`}>
                                <div className="avatar rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">

                                <img src={avatar} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                {onlinestatus? <div className="dot h-[18px] w-[18px] bg-emerald-500 rounded-[50%] flex z-60 absolute right-0 top-14 "></div>:
                                 <div className="dot h-[18px] w-[18px] bg-slate-400 rounded-[50%] flex z-60 absolute right-0 top-14 "></div>}
                               
                                </div>
                                <div className="displayname    px-4 flex flex-col">
                                    <h1 className="text-[#3b2b60] sm:text-[20px] lg:text-[26px] font-bold ">{displayname}</h1>
                                    <div className="username bg   bg-[#ebae3f] flex justify-center rounded-[20px]">
                                        <h1 className="font-bold  text-[rgb(255,255,255)]">{userid}</h1>
                                    </div>
                                    <div className="alls w-full"> 
                                    <div className="firendsstatus flex justify-around flex-col  ">
                                        <button onClick={()=> {
                                            if(relation === "Unfriend") {
                                                console.log("Unfriend");
                                                sendUnfriendRequest(userid);
                                            }
                                            else{
                                                sendFriendRequest(userid);
                                            }
                                        }}>{relation}</button>

                                        {relation === "Unfriend" ? <button onClick={()=> {
                                            if(blockstatus === "Block")
                                                sendblockRequest(userid);
                                            else
                                                sendUnblockRequest(userid);
                                        }}>{blockstatus}</button>:null}
                                    </div>
                                    
                                    </div>
                                        
                                </div>
                        </div>
                        <div className={`userinfo  xl:w-[50%] lg:w-[50%] md:w-[50%] h-[90%] py-5 sm:py-12 md:py-16   flex justify-start my-1 items-center px-3 lg:px-7  bg-[#f4d47d] mx-4 rounded-br-[50px] md:rounded-br-[18px] md:rounded-tr-[80px] md:rounded-l-[18px]`}>
                                <div className="avatar rounded-[50%] relative sm:w-[80px] sm:h-[80px] h-[50px] w-[50px] flex justify-center items-center bg-[#453176] ">
                                    <img src={"/profile/leveluser.png"} className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[100px] min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                </div>

                                <div className="displayname w-full px-4 flex flex-col">
                                    <h1 className="text-[#3b2b60] sm:text-[23px] lg:text-[26px] font-bold ">Level 20</h1>
                                    <h2 className="text-[#3b2b60]  sm:text-[21px]  bottom-2 font-light ">Congrats! You're intermediate now</h2>
                                    <div className="w-full bg-[#fae1a1] rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-[#3d2d6d] h-2.5 rounded-full" style={{width: "45%"}}></div>
                                    </div>
                            </div>
                        </div>
                       
                    </div>
                </div>
        </div>
    );
}

