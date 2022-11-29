import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProfileM from "../../components/profile/Profilem";
import Sidebar from "../../components/profile/Sidebar";
import Useravatar from "../../components/profile/Useravatar";
import { Apis } from "../../network/apis";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import Infouser from "../../components/profile/Infouser";
import Link from "next/link";
import styles from "../../styles/Profile/user.module.css"
import Overview from "../../components/profile/overview";
import axios from "axios";
import { style } from "@mui/system/Stack/createStack";
import { IoConstructOutline } from "react-icons/io5";
import { ProfilesUser } from "../../network/dto/payload/profileuser";
import MatchHistory from "../../components/profile/match_history";
import { height } from "@mui/system";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { ProfileResponse } from "../../network/dto/response/profile-response.dto";
import { localService } from "../../network/local.service";
import { FriendsResponse } from "../../network/dto/response/friends-response.dto";

export default function Profile() {
    const router = useRouter();
    const [username, setusername] = useState('')
    const [avatar, setavatar] = useState("");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [view_history, setview_history] = useState(false);
    const [opensettings, setopensettings] = useState(false);
    const [openfriends, setopenfriends] = useState(false);
    const [currnetdispayname, setcurrnetdispayname] = useState('');
    const [displayName, setdisplayName] = useState('');
    const [alertUI, setAlertUI] = useState({
        show: false,
        messages: [""],
        severity: "",
    });
    useEffect(() => {
        Apis.CurrentProfile(
            {
                onSuccess: (profile: ProfileResponse) => {
                    setusername(profile.username);
                    setcurrnetdispayname(profile.displayName);
                    setavatar(profile.avatar);
                    //  setavatar("/profile/Avatar.png");
                },
                onFailure: (error: ErrorResponse) => {
                    console.log(error.message)
                }
            }
        )

        Apis.getFriends({
            onSuccess: (friends: FriendsResponse[]) => {
                console.log(friends);
                //TODO: set friends to UI
            },
            onFailure: (error: ErrorResponse) => {},
        });

        let task: NodeJS.Timer | null = null;

        setTimeout(() => {
            window?.statesSocket?.on("FriendsStates", (data) => {
                // TODO: set online/offline/status and bind it to profile
                console.log(`received data: ${JSON.stringify(data)}`);
            });

            task = setInterval(() => {
                window.statesSocket!.emit("FriendsStates");
            }, 2000);

        }, 500);

        return () => {
            if (task)
                clearInterval(task);
        };

    }, []);

    
    const RecentGame = [
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 5,
        }
    ];

    const listFreinds = [
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 5,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 7,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 9,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 10,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 11,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 3,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 1,
        },
        {
            image: avatar,
            displayn: currnetdispayname,
            user: username,
            resultmtch: 2,
        },
    ];

    useEffect(() => {
        if (uploadFile) {
            const formData = new FormData();
            formData.append("avatar", uploadFile);
            localService
                .post("/api/profiles/avatar", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    const avatar = res.data.url;
                    console.log("new avatar url: " + avatar);
                    setavatar(avatar);
                    setUploadFile(null);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [uploadFile]);

    return (
        <>
            <div className="w-full flex absolute justify-end h-full top-0 right-0  ">
                <div className={`background z-10 absolute w-full h-full ${styles.background} `}></div>
                <div className="bgopaci z-20 top-0 opacity-90 left-0 w-full  bg-[#463573] "></div>
                <div className="contain absolute w-full h-full flex xl:justify-between">
                    {openfriends || opensettings ? <div className="si xl:hidden absolute lg:hidden md:hidden z-60  sm:hidden hidden" >
                        <Sidebar />

                    </div> : <div className="si xl:flex relative lg:hidden md:hidden z-60  sm:hidden hidden" >
                        <Sidebar />

                    </div>}



                    <div className="allinfo  z-50   w-full  xl:w-[84%] 2xl:w-[89%] h-[full]">
                   <div className={`menu z-60  w-full h-[98px] flex xl:hidden rounded-b-3xl items-center px-10 ${styles.btnsettings1}`}>
                        <img src="/profile/LOGO.png" className="w-[18%]" alt="" />
                            <div className="sm:flex justify-center w-full  ">
                                <div className="menu flex list-none justify-around h-full lg:w-[60%] sm:w-[80%] ">
                                    <li className="text-[23px] flex font-semibold text-[#463573] bg-[#ebca83] p-1 rounded-[18px] justify-center px-5 mx-1"> <img className="" src="/profile/Home.png" alt="" /> <p className="sm:flex hidden">Home</p> </li>
                                    <li className="text-[23px] flex font-semibold text-[#463573] bg-[#ebca83] p-1 rounded-[18px] justify-center px-5 mx-1"> <img src="/profile/Profile user.png" alt="" /><p className="sm:flex hidden">Profile</p>  </li>
                                    <li className="text-[23px] flex font-semibold text-[#463573] bg-[#ebca83] p-1 rounded-[18px] justify-center px-5 mx-1"> <img src="/profile/chat.png" alt="" /><p className="sm:flex hidden">Chat</p>  </li>
                                    <li className="text-[23px] flex font-semibold text-[#463573] bg-[#ebca83] p-1 rounded-[18px] justify-center px-5 mx-1"> <img src="/profile/level.png" alt="" /><p className="sm:flex hidden">Game</p>  </li>

                                </div>
                            </div>


                   </div>
                        {openfriends ? <div className="popup absolute justify-center  z-50 w-full items-center h-full flex  ">
                            <div className="bgopaci absolute top-0 left-0 w-full h-full  min-w-full bg-opacity-95  bg-[#463573] " onClick={() => setopenfriends(!openfriends)}></div>
                            <div className="popupsettings absolute z-10 bg-white w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] xl:w-[60%] 2xl:w-[800px]  h-[45%] rounded-[18px]">
                                <div className="closebtn w-full flex justify-end p-8">
                                    <button className="text-[23px]  flex justify-end text-[#000] w-[30px] " onClick={() => setopenfriends(!openfriends)}><img src="/profile/popup/exit.png" alt="" /></button>
                                </div>
                                <div className="friend w-full flex justify-center">
                                    <h1 className="text-[25px] font-bold text-[#42386f]">All Friends <span>{'(14)'}</span></h1>
                                </div>
                                <div className="listfriend  w-full flex justify-center items-center overflow-y-scroll mt-4 relative pt-[50%]  h-[69%] flex-col">
                                    {listFreinds.map((friends, index) => {
                                        return (<>
                                            <div key={index} className="list  bg-[#dddae4] w-[90%] h-24 mt-3 rounded-[20px] justify-around flex items-center px-5">
                                                <div className="img w-[84px] z-20  rounded-full justify-center  bg-white h-[84px] items-center flex">
                                                    <img src={avatar} crossorigin="anonymous" className={`rounded-full w-[75px]`} alt="ss" />
                                                </div>
                                                <div className="displayname_user px-4 relative ">
                                                    <h1 className="font-bold text-[20px]">{currnetdispayname}</h1>
                                                    <h1 className="text-[18px]">@{username}</h1>
                                                </div>
                                                <div className="btns flex">
                                                    <div className={`btnprofile flex p-5 justify-center rounded-[20px] cursor-pointer ${styles.btnprofile}`}>
                                                        <img src="/profile/popup/user.png" className="w-[30px] " alt="" />
                                                        <p className="px-2 text-[19px] font-bold text-[#4b3d7f]">Profile</p>
                                                    </div>
                                                    <div className={`btncontact mx-2 flex p-5 justify-center rounded-[20px] cursor-pointer ${styles.btnconact}`}>
                                                        <img src="/profile/popup/chat.png" className="w-[30px]" alt="" />
                                                        <p className="px-2 text-[19px] font-bold text-[#fff]">Contact</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </>)
                                    })}
                                </div>
                            </div>
                        </div>
                            : null}
                        {opensettings ? <div className="popup absolute justify-center  z-50 w-full items-center h-full flex  ">
                            <div className="bgopaci absolute top-0 left-0 w-full h-full  min-w-full bg-opacity-95  bg-[#463573] " onClick={() => setopensettings(!opensettings)}></div>
                            <div className="popupsettings absolute z-10 bg-white w-[85%] sm:w-[75%] md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[600px] h-[50%] rounded-[18px]">
                                <div className="closebtn w-full flex justify-end p-8">
                                    <button className="text-[23px]  flex justify-end text-[#000] w-[30px] " onClick={() => setopensettings(!opensettings)}><img src="/profile/popup/exit.png" alt="" /></button>
                                </div>
                                <div className="avatar flex relative bottom-10 justify-center flex-col items-center w-full ">
                                    <div className="avatar  rounded-[50%] relative min-w-[70px] min-h-[70px] h-[80px] w-[80px] lg:w-[92px] lg:h-[90px] flex justify-center items-center bg-[#453176] ">
                                        <img src={avatar} crossOrigin="anonymous" className={`rounded-[50%] w-[47px] sm:w-[75px] lg:w-[90px] sm:p-1  min-w-[70px] min-h-[70px]   relative bottom-[2px] `} alt="" />
                                    </div>
                                    <h1 className="text-[#3b2b60] sm:text-[20px] lg:text-[26px] font-bold ">{currnetdispayname}</h1>
                                    <h1 className=" font-light  text-[#3b2b60] text-[23px]">@{username}</h1>
                                    <div className="form w-full justify-center flex flex-col items-center">

                                        <form className="flex w-[66%] flex-col mt-7" encType="multipart/form-data">
                                            <input type="file" name="file" id="file" className="inputfile hidden" onChange={(e) => {
                                                if (e.target.files) {
                                                    setUploadFile(e.target.files[0]);
                                                }
                                                console.log('file content:');
                                                console.log(e.target.files![0]);
                                            }}  multiple />
                                            <label htmlFor="file" ><h1 className={`text-[22px] relative grow md:flex-grow-0 font-bold  mx-3 mt-2 py-2 rounded-[19px] lg:px-9 text-[#3f2d70] flex justify-center  cursor-pointer ${styles.btnsettings} `}>Upload Avatar</h1></label>

                                            <p className=" my-4 text-[#3b2b60] sm:text-[18px] lg:text-[20px] font-bold">Display Name</p>
                                            <input
                                                type="text"
                                                className="border border-gray-500 py-3 rounded-xl px-5"
                                                // value={currnetdispayname}
                                                placeholder={currnetdispayname}
                                                onClick={(e) => { e.target.value = '' }}
                                                onChange={(e) => setdisplayName(e.target.value)}

                                            />
                                            <p className="mt-6  text-[#3b2b60] sm:text-[18px] lg:text-[20px] font-bold">Username</p>
                                            <input
                                                type="text"
                                                className="border py-3 rounded-xl border-gray-500 px-5 bg-[#dfdcf1]"
                                                disabled
                                                value={'@' + username}
                                            // onChange={(e) => setName(e.target.value)}
                                            />

                                        </form>
                                        {alertUI.show ? (
                                            <div className="ml-8 my-5 mr-8">
                                                <Alert
                                                    severity={alertUI.severity === "error" ? "error" : "success"}
                                                >
                                                    <AlertTitle>
                                                        {alertUI.messages.map((message) => {
                                                            return <ul key="" >
                                                                <p key="" >
                                                                    <strong>{alertUI.messages.length > 1 ? "•" : ""} {message}<br /></strong>
                                                                </p>
                                                            </ul>
                                                        })}
                                                    </AlertTitle>
                                                </Alert>
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                        <button className={`btncontact w-[40%] mx-2 flex p-3 justify-center rounded-[20px] cursor-pointer mt-7 ${styles.btnconact}`} onClick={() => {
                                            Apis.UpdateDisplayName({
                                                displayNameDto: { displayName: displayName }, onSuccess: () => {
                                                    setAlertUI({
                                                        show: true,
                                                        messages: [`Display Name ${displayName} is changed`],
                                                        severity: "success",
                                                    });
                                                    setdisplayName(displayName);
                                                    setcurrnetdispayname(displayName);
                                                    setTimeout(() => {
                                                        setAlertUI({   show: false, messages: [], severity: "" }); setopensettings(!opensettings)  }, 1500);
                                                }, onFailure(err: ErrorResponse) {
                                                    if (err.message) {
                                                        setAlertUI({
                                                            show: true,
                                                            messages:
                                                                typeof err.message === "string"
                                                                    ? [err.message]
                                                                    : err.message,
                                                            severity: "error",
                                                        });
                                                    }
                                                },
                                            })


                                        }}><h1 className="text-[22px] font-bold text-[#fff] ">Save Profile</h1></button>
                                        <button></button>
                                    </div>


                                </div>


                            </div>
                        </div>
                            : null}

                        <div className="contain  flex-col py-20  flex w-full h-full ">
                            <div className="avatar px-10 sm:px-20 md:px-28 lg:px-32 xl:px-44 2xl:px-72">
                                <Useravatar avata={avatar} userid={currnetdispayname} />
                            </div>
                            <div className="info px-6 lg:px-10 py-8  flex justify-center">
                                <Infouser avatar={avatar} userid={username} displayname={currnetdispayname} />
                            </div>
                            <div className="info px-6 lg:px-10 py-8 flex justify-center  w-full h-full">
                                <div className="over w-[95%] xl:w-[75%] rounded-[20px] bg-opacity-50 bg-[#3d2c6bbe]" style={{ height: view_history ? "80%" : "55%" }}>
                                    <div className="menu bg-opacity-50 bg-[#644dad] w-full flex rounded-[20px] flex-col md:flex-row ">
                                        <div className="firstbtn flex py-2 px-2 flex-col md:flex-row md:justify-between w-full">
                                            <div className="btns flex flex-grow ">
                                                <h1 onClick={() => setview_history(false)} style={{ background: view_history ? "#5d48a3db" : "#705bb1" }} className=" flex-grow md:flex-grow-0 sm:text-[25px] md:px-4 lg:px-9 font-bold   py-4 rounded-[19px] bg-[#705bb1] text-[#cec0fb] flex justify-center  cursor-pointer">Overview</h1>
                                                <h1 onClick={() => setview_history(true)} style={{ background: view_history ? "#705bb1" : "#5d48a3db" }} className="sm:text-[25px] flex-grow md:flex-grow-0 font-bold md:px-4 lg:px-9  mx-1 py-4 rounded-[19px] bg-[#5d48a3db] text-[#cec0fb] flex justify-center  cursor-pointer">Match History</h1>
                                                <h1 onClick={() => setopenfriends(!openfriends)} className="sm:text-[25px] font-bold  mx-2 py-4 rounded-[19px] flex-grow md:flex-grow-0 bg-[#5d48a3db] md:px-4 lg:px-9 text-[#cec0fb] flex justify-center  cursor-pointer">Friends</h1>
                                            </div>
                                            <div className="btnsettings">

                                                <h1 onClick={() => setopensettings(!opensettings)} className={`text-[25px] relative grow md:flex-grow-0 font-bold  mx-3 py-4 rounded-[19px] lg:px-9 text-[#3f2d70] flex justify-center  cursor-pointer ${styles.btnsettings} `}>Settings</h1>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <Overview/> */}
                                    {view_history ?
                                        <MatchHistory listFreinds={listFreinds} avatar={avatar} userid={username} />

                                        : <Overview RecentGame={RecentGame} avatar={avatar} />}

                                </div>
                            </div>


                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}
