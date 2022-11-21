import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoArrowBackCircle } from "react-icons/io5";

import { Apis } from "../../network/apis";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import styles from "../../styles/auth/C_signup.module.css";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export default function C_signup() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [Displayname, setDisplayname] = useState("");
  const [alertUI, setAlertUI] = useState({
    show: false,
    messages: [""],
    severity: "",
  });
  const router = useRouter();

  return (
    <>
      <div className="signpage w-full flex sm:justify-around absolute justify-end md:justify-around h-full top-0 z-100 right-0 bg-[#fff] sm:items-center flex-col-reverse  md:flex-row sm:flex-row">
        <Link href="/" color={"#000"}>
          <div className="backhome absolute flee top-8 left-6 text-[18px] flex items-center cursor-pointer">
            <IoArrowBackCircle />
            <span className="pl-2">ft_transcendence</span>
          </div>
        </Link>
        <div className="formside  sd:w-[50%] w-full sd:min-w-[500px]  flex justify-center items-center flex-col sm:mt-0 mt-10">
          {alertUI.show ? (
            <div className="ml-8 mr-8">
              <Alert
                severity={alertUI.severity === "error" ? "error" : "success"}
              >
                <AlertTitle>
                  {alertUI.messages.map((message) => {
                    return <ul key="" >
                      <p key="" >
                        <strong>{alertUI.messages.length > 1 ? "•" : "" } {message}<br/></strong> 
                      </p>
                    </ul>
                  })}
                </AlertTitle>
              </Alert>
            </div>
          ) : (
            <div />
          )}
          <div className="fo">
            <h1 className="text-[35px]">Create new acccount </h1>
            <p className="font-light text-[13px]">
              Welcome! Please enter your details.
            </p>
            <br />
            <div className="form">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  Apis.SignUp({
                    signupDto: {
                      username: username,
                      displayName: Displayname,
                      password: password,
                    },
                    onSuccess: () => {
                      setAlertUI({
                        show: true,
                        messages: [`user ${username} registered succecfully`],
                        severity: "success",
                      });
                      setTimeout(() => {
                        router.push("/home");
                      }, 1500);
                    },
                    onFailure: (err: ErrorResponse) => {
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
                  });
                }}
              >
                <div className="input-container flex flex-col">
                  <label className="text-[15px]">Username </label>
                  <input
                    className="  border-gray-400 border-[1px] rounded-md h-[34px] p-[15px] "
                    onChange={(e) => {
                      setusername(e.target.value);
                    }}
                    placeholder="Enter your username"
                    type="text"
                    name="uname"
                    required
                  />
                </div>
                <br />
                <div className="input-container flex flex-col">
                  <label className="text-[15px]">Display name </label>
                  <input
                    className="  border-gray-400 border-[1px] rounded-md h-[34px] p-[15px] "
                    onChange={(e) => {
                      setDisplayname(e.target.value);
                    }}
                    placeholder="Enter your Display name"
                    type="text"
                    name="uname"
                    required
                  />
                </div>
                <br />
                <div className="input-container flex flex-col">
                  <label className="text-[15px]">Password </label>
                  <input
                    className="  border-gray-400 border-[1px] rounded-[5px] h-[34px] p-[15px]"
                    onChange={(e) => {
                      setpassword(e.target.value);
                    }}
                    type="password"
                    name="pass"
                    placeholder="   Enter your password"
                    required
                  />
                </div>
                <br />
                <div className="button-container">
                  <button
                    type="submit"
                    className="bg-[#785cd3] w-full pb-[6px] pt-[6px] rounded-[5px] text-[#fff]"
                  >
                    Sign up
                  </button>
                  {/* <ToastContainer/> */}
                </div>
              </form>

              <button
                onClick={() => {
                  Apis.autherizeFortytwo();
                }}
                className="w-full mt-3 pb-[6px] pt-[6px] rounded-[5px] text-[#fff] bg-[#121212] flex justify-center items-center"
              >
                <img src="/42_logo.svg" className="w-[20px] " alt="ddd" />
                <span className="pl-2 text-[18px]">Network</span>
              </button>

              <div className="signup mt-3 flex text-[14px] w-full justify-center">
                <p>have an account?</p>
                <Link href={"/signin"}>
                  <span className="ml-[6px] cursor-pointer text-[#785cd3]">
                    Sign in
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`logo relative  sd:w-[50%] w-full sm:h-full sd:min-w-[500px] flex justify-center items-center flex-col text-start ${styles.rightside}`}
        >
          <img
            src="/auth/vector_Sing_up.png"
            alt="fwoeifj"
            className="sd:w-[80%] md:w-[80%] rounded-[5px]"
          />
          {/* <div className="backdrop-blur-md bg-white/30 sm:w-[80%] md:w-[80%] sd:min-w-[320px] sm:h-[20%] top-[50%] h-[50%] lg:h-[30%]  absolute"></div> */}
        </div>
      </div>
    </>
  );
}
