import { useState } from "react";
import { HiMenu,HiMenuAlt2 } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { FaHome,FaUserAlt } from "react-icons/fa";
import { BsFillChatTextFill } from "react-icons/bs";
import { RiPingPongFill,RiMovieFill } from "react-icons/ri";
import { BiLogOut } from "react-icons/bi";
import style from "../../styles/app/Sidebar.module.css"
import Link from "next/link";






export default function Sidebar({isopen,setisopen}:any) {
    // const [isopen, setisopen] = useState(false);
    const toggol = () =>setisopen(!isopen);
    const out = () =>setisopen(isopen);

    return (
        <>
        {/* <div className="backgroundblack absolute top-0 left-0 w-full h-screen "></div> */}
        <div className="navbar absolute z-10 h-screen bg-cyan-900 drop-shadow-{30} duration-500" style={{width:isopen ?"15rem":"6rem",borderRadius:"0 23px 24px 0"}}>
            <nav className="nav_list list-none	">
                <div className="openbtn text-[35px] p-7 pt-12 flex justify-center" onClick={toggol}>
                    {isopen ?<HiMenuAlt2 color="#fff" /> :<HiMenu color="#fff"/>}
                </div>
                <ul className="all_list text-zinc-50 flex items-center flex-col" style={{transition:"all 0.5"}}>
                    <li className={`list py-9`}  >
                            {isopen ? 
                            <Link href={"/home"} ><a className={`flex w-40 h-12 rounded-2xl justify-center  items-center ${style.list}`} style={{background:"#087E8B"}}>
                                <i className="px-3"><FaHome size={30}/></i>
                                Home
                            </a></Link>
                            : <Link href={"/home"}><a className={`flex w-16 h-12 items-center rounded-xl justify-center ${style.list}`} style={{background:"#087E8B"}}>
                                <i><FaHome size={30}/></i>
                            </a></Link>}
                    </li>
                    <li className="list py-9">
                            {isopen ? 
                            <Link href={"/profile"}><a href="#" className="flex w-40 h-12 hover:bg-teal-100 hover:text-black rounded-2xl justify-center  items-center">
                                <i className="px-3"><FaUserAlt size={30}/></i>
                                Profile
                            </a></Link>
                            :<Link href={"/profile"}><a href="#">
                                <i><FaUserAlt size={30}/></i>
                            </a></Link>}                    </li>
                    <li className="list py-9">
                            {isopen ? 
                            <a href="#" className="flex justify-center items-center">
                                <i className="px-3"><BsFillChatTextFill size={30}/></i>
                                Chat
                            </a>
                            :<a href="#">
                                <i><BsFillChatTextFill size={30}/></i>
                            </a>}                    </li>
                    <li className="list py-9">
                            {isopen ? 
                            <a href="#" className="flex justify-center items-center">
                                <i className="px-3"><RiPingPongFill size={30}/></i>
                                Game
                            </a>
                            :<a href="#">
                                <i><RiPingPongFill size={30}/></i>
                            </a>}                    </li>
                    <li className="list py-9">
                            {isopen ? 
                            <a href="#" className="flex justify-center items-center">
                                <i className="px-3"><RiMovieFill size={30}/></i>
                                Stream
                            </a>
                            :<a href="#">
                                <i><RiMovieFill size={30}/></i>
                            </a>}                    </li>

                            <div className="h-60 flex justify-end items-end  ">

                <li className="list py-9">
                            {isopen ? 
                            <Link href={"/"}><a className="flex justify-center items-center">
                                <i className="px-3"><BiLogOut size={30}/></i>
                                Log Out
                            </a></Link>
                            :<Link href={"/"}><a href="#">
                                <i><BiLogOut size={30}/></i>
                            </a></Link>}                    </li>
                </div>

                </ul>

            </nav>
        </div>
        </>
    );
}


// import { useState } from "react";
// import { HiMenu,HiMenuAlt2 } from "react-icons/hi";
// import { AiOutlineUser } from "react-icons/ai";
// import { FaHome,FaUserAlt } from "react-icons/fa";
// import { BsFillChatTextFill } from "react-icons/bs";
// import { RiPingPongFill,RiMovieFill } from "react-icons/ri";
// import { BiLogOut } from "react-icons/bi";
// import style from "../styles/Sidebar.module.css"






// export default function Sidebar() {
//     const [isopen, setisopen] = useState(false);
//     const toggol = () =>setisopen(!isopen);
//     return (
//         <>
//         {isopen ? <div className="backgroundblack absolute top-0 left-0 w-full h-screen bg-black opacity-80 ease-in duration-500" ></div> :null}
//         <div className="navbar absolute h-screen bg-cyan-900 drop-shadow-{30} rounded-r-lg ease-in duration-50" style={{width:isopen ?"15rem":"6rem"}}>
//             <nav className="nav_list list-none	">
//                 <div className="openbtn text-[35px] p-7 pt-12 flex justify-center" onClick={toggol}>
//                     {isopen ?<HiMenuAlt2 color="#fff" /> :<HiMenu color="#fff"/>}
//                 </div>
//                 <ul className="all_list  text-zinc-50 flex items-center flex-col">
//                     <li className="list py-14">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><FaHome size={30}/></i>
//                                 Home
//                             </a>
//                             :<a href="#">
//                                 <i><FaHome size={30}/></i>
//                             </a>}
//                     </li>
//                     <li className="list py-9">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><FaUserAlt size={30}/></i>
//                                 Profile
//                             </a>
//                             :<a href="#">
//                                 <i><FaUserAlt size={30}/></i>
//                             </a>}                    </li>
//                     <li className="list py-9">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><BsFillChatTextFill size={30}/></i>
//                                 Chat
//                             </a>
//                             :<a href="#">
//                                 <i><BsFillChatTextFill size={30}/></i>
//                             </a>}                    </li>
//                     <li className="list py-9">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><RiPingPongFill size={30}/></i>
//                                 Game
//                             </a>
//                             :<a href="#">
//                                 <i><RiPingPongFill size={30}/></i>
//                             </a>}                    </li>
//                     <li className="list py-9">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><RiMovieFill size={30}/></i>
//                                 Stream
//                             </a>
//                             :<a href="#">
//                                 <i><RiMovieFill size={30}/></i>
//                             </a>}                    </li>

//                             <div className="h-60 flex justify-end items-end  ">

//                 <li className="list py-9">
//                             {isopen ? 
//                             <a href="#" className="flex justify-center items-center">
//                                 <i className="px-3"><BiLogOut size={30}/></i>
//                                 Log Out
//                             </a>
//                             :<a href="#">
//                                 <i><BiLogOut size={30}/></i>
//                             </a>}                    </li>
//                 </div>

//                 </ul>

//             </nav>
//         </div>


//         </>
//     );
// }