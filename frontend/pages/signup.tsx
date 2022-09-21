import { IoArrowBackCircle } from "react-icons/io5";
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/router";
import { Apis } from '../network/apis'
import {User} from "../model/user"



export default function signin(){
    const [username,setusername] = useState('');
    const [password,setpassword] = useState('');
    const [signup,setsignup] = useState(true);

    const router = useRouter();
    
    return (
        <>
        <div className="signpage w-full flex sm:justify-around absolute justify-end md:justify-around h-screen top-0 z-100 right-0 bg-[#fff] sm:items-center flex-col-reverse  md:flex-row sm:flex-row">
                <Link href="/" color={"#000"}><div className="backhome absolute flee top-8 left-6 text-[18px] flex items-center cursor-pointer">
                    <IoArrowBackCircle/>
                    <span className="pl-2">ft_transcendence</span>
                </div>
                </Link>
        <div className="formside border-r-2 border-slate-900  sd:w-[50%] w-full sd:min-w-[500px]  flex justify-center items-center flex-col sm:mt-0 mt-10">
               <div className="fo">
                   <h1 className="text-[35px]">Create new acccount </h1>
                   <p className="font-light text-[13px]">Welcome! Please enter your details.</p>
                   <br />
                   <div className="form">
                       <form onSubmit={(e) =>{
                           e.preventDefault();
                        //    Apis.SignUp({
                        //     user: {username:username,password:password},
                        //     onSuccess: (user: User) => {
                        //         alert(user.username);

                        //       },
                        //       onFailure: (err: ErrorResponse) => {
                        //         alert("couldn't fetch user");
                        //       }


                        // })
                        //    router.push('/home');
                        //    console.log(username);
                        //    console.log(password);
                            console.log(`${username} your account has been created.`);
                       }}> 
                       <div className="input-container flex flex-col">
                           <label className="text-[15px]">Email </label>
                           <input className="  border-gray-400 border-[1px] rounded-md h-[34px] p-[15px] " onChange={(e) =>{setusername(e.target.value);}} placeholder="Enter your email" type="text" name="uname" required  />
                       </div>
                       <br />
                       <div className="input-container flex flex-col">
                           <label className="text-[15px]">Password </label>
                           <input className=" w-[300px] border-gray-400 border-[1px] rounded-[5px] h-[34px] p-[15px]" onChange={(e) =>{setpassword(e.target.value);}} type="password" name="pass" placeholder="   Enter your password" required />
                       </div>
                       <br />
                       <div className="check flex justify-between items-center">
                           <div className="checkb flex items-center">
                               <input type="checkbox" ></input>
                               <label htmlFor="checkbox"  className="text-[12px] ml-[4px]">Remember me for 30 days.</label>
                           </div>
                       </div>
                       <br />
                       <div className="button-container">
                           <button type="submit"  className="bg-[#785cd3] w-full pb-[6px] pt-[6px] rounded-[5px] text-[#fff]">Sign in</button>
                       </div>
                       </form>
                       
                       <button onClick={() => {
                           router.push('/api/auth/intra')
                       }} className="w-full mt-3 pb-[6px] pt-[6px] rounded-[5px] text-[#fff] bg-[#e77781] flex justify-center items-center">
                           <img src="42_logo.svg" className="w-[20px] " alt="ddd" />
                           <span className="pl-2 text-[18px]">Network</span>
                           </button>
                       <div className="signup mt-3 flex text-[14px] w-full justify-center">
                           <p>have an account?</p>
                           <Link href={"/signin"} ><span className="ml-[6px] cursor-pointer text-[#785cd3]">Sign in</span></Link> 
                       </div>

                   </div>
               </div>
           </div>
           <div className="logo border-r-2 relative border-slate-900 sd:w-[50%] w-full sm:h-full bg-[#f3f4f7] sd:min-w-[500px] flex justify-center items-center flex-col text-start">
                    <img src="nano.png"  className="sd:w-[80%] md:w-[80%] rounded-[5px]" alt="" />
                    {/* <div className="backdrop-blur-md bg-white/30 sm:w-[80%] md:w-[80%] sd:min-w-[320px] sm:h-[20%] top-[50%] h-[50%] lg:h-[30%]  absolute"></div> */}
                </div>
            </div>
        </>
    );
}