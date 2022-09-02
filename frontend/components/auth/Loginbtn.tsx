import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';
import { Api } from '../../network/api/api.request';
import { ErrorResponse } from '../../network/dto/error-response.dto';
import style from "../../styles/auth/Loginbtn.module.css";

function login(router: NextRouter) {
    Api.login({
        user: { username: 'john', password: '123' },
        onSuccess: () => {
            router.push('/home');
        },
        onFailure: (err: ErrorResponse) => {
            if (err)
                alert(err.message);
        }
    });
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
