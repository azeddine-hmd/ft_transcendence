import { AxiosResponse } from 'axios';
import { redirect } from 'next/dist/server/api-utils';
import { NextRouter, useRouter } from 'next/router';
import apiService from '../../src/api.service';
import style from "../../styles/auth/Loginbtn.module.css";

function login(router: NextRouter) {
    apiService.get("/auth").then(function(res: AxiosResponse) {
        //alert(res.data);
        if (res.status === 200)
            router.push("/auth");
    }).catch(err => {
        alert('something went wrong while connecting to backend');
    })
}

export default function LoginBtn() {
    const router = useRouter();
    const loginHandler = function() { login(router); };

    return (
        <>
            {/* <Image className="img42" src={"https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png"} width={200} height={200} /> */}
            <div className={style.login}></div>
            <div className={style.btn_login}>
                <div className={style.login_logo}>
                    <img className={style.img42} src="https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png" alt="42 network logo"/>
                    <button className={style.Login} onClick={loginHandler}>Login</button>
                </div>
            </div>
        </>
    );
}
