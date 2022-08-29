import { AxiosError, AxiosResponse } from 'axios';
import { NextRouter, useRouter } from 'next/router';
import { apiService } from '../../network/api.service';
import style from "../../styles/auth/Loginbtn.module.css";

function login(router: NextRouter) {
    apiService.post("/auth/login", { username: 'john', password: 'changeme', },
    ).then((res: AxiosResponse) => {
        alert(res.data);
        router.push("/home");
    }).catch((err: AxiosError) => {
        alert(err);
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
                    <img className={style.img42} src="https://miro.medium.com/max/2400/1*uvFfoFvPeLyRbkj62tbnGg.png" alt="42 network logo" />
                    <button className={style.Login} onClick={loginHandler}>Login</button>
                </div>
            </div>
        </>
    );
}
