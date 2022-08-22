import style from "../../styles/auth/Loginbtn.module.css"
import { useRouter } from 'next/router'
import Image from "next/image";
import image from "./ezgif.com-gif-maker (1).gif"
// import { useRouter } from "next/router";

export default function Loginbtn() {
    const router = useRouter();
    function handlebutton() {
        router.push("/app");
    }
    return (
        <>

            {/* <Image className="img42" src={"https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png"} width={200} height={200} /> */}
            <div className={style.login}></div>
            <div className={style.btn_login}>
                <div className={style.login_logo}>
                    <img className={style.img42} src="https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png" alt="" />
                    <button className={style.Login} onClick={handlebutton}>Login</button>
                </div>
            </div>
        </>
    );
}