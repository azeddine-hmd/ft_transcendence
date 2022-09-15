import { Apis } from "../../network/apis";
import style from "../../styles/auth/Loginbtn.module.css";

function login() {
    Apis.autherizeFortytwo();
}

export default function LoginBtn() {
    return (
        <>
            {/* <Image className="img42" src={"https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png"} width={200} height={200} /> */}
            <div className={style.login}></div>
            <div className={style.btn_login}>
                <div className={style.login_logo}>
                    <img className={style.img42} src="https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png" alt="42 network logo" />
                    <button className={style.Login} onClick={login}>Login</button>
                </div>
            </div>
        </>
    );
}
