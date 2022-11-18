import Head from "next/head";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { Apis } from "../../network/apis";
import styles from "../../styles/home/Loginbtn.module.css";

function login(router: NextRouter) {
  Apis.autherizeFortytwo();
}

export default function LoginBtn() {
  const router = useRouter();
  const _login = () => {
    login(router);
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="contain bg-[#371867]  absolute z-10 w-full h-full min-w-full">
        <img
          src="bg_home.jpeg"
          className="h-full  fixed w-full opacity-30"
          alt=""
        />

        {/* <img src="texture.png"  className=" h-full fixed w-full" alt="" /> */}
        <div className="centrecontain flex h-full w-full relative justify-around  items-center  flex-wrap-reverse  ">
          <div className="logo sm:min-w-[400px] w-[500px] min-w-[200px]">
            <img
              src="logo.png"
              className="sm:min-w-[500px] min-w-[200px] "
              alt=""
            />
            <br />
            <p className=" w-[400px] sm:w-full sm:min-w-[300px] min-w-[300px]  text-[#fff]">
              The object is to hit the ball so that it goes over the net and
              bounces on the opponent's half of the table in such a way that the
              opponent cannot reach it or return it correctly. The lightweight
              hollow ball is propelled back and forth across the net by small
              rackets (bats, or paddles) held by the players.
            </p>
            <br />
            <div className="btns w-full flex justify-around  ">
              <Link href={"/signup"} className="cursor-pointer">
                <button
                  className={`bg-[#eaa93b] transition delay-100 duration-300 ease-in-out hover:text-[#eaa93b] text-[#251850] hover:bg-white shadow-sm py-3 sm:px-20 md:px-16 px-12 rounded-[30px] text-[26px] min-w-[60px] flex justify-center cursor-pointer whitespace-nowrap ${styles.btns}`}
                >
                  Sign up
                </button>
              </Link>
              <Link href={"/signin"} className="cursor-pointer">
                <button
                  className={`border-2 transition delay-100 duration-300 hover:border-[#fff] hover:text-[#fff] border-[#eaa93b] text-[#eaa93b] shadow-sm py-3 sm:px-16 px-12 flex justify-center rounded-[30px] text-[26px] whitespace-nowrap  cursor-pointer ${styles.btns}`}
                >
                  Sign in
                </button>
              </Link>
            </div>
          </div>
          <div className="imgl relative md:w-[500px] lg:w-[600px]  w-[400px] hidden sm:flex  ">
            <img
              src="Light.png"
              className="sm:h-[800px] md:h-0 w-[1000px] lg:h-[800px] h-[200px]  opacity-40  min-w-[300px]"
              alt=""
            />
            <img
              src="ping_ping_vector.png"
              className={`absolute md:top-0  lg:top-48 flex md:items-start sm:top-48 lg:h-[500px] lg:w-[800px] top-14 min-w-[400px] ${styles.animation1}`}
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
