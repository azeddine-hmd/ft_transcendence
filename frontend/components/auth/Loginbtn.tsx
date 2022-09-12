import style from "../../styles/auth/Loginbtn.module.css";

function getIntraAuthUrl(): string {
    const fortytwoAuthUrl = new URL(process.env.NEXT_PUBLIC_INTRA_AUTH_URL!);
    fortytwoAuthUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!);
    fortytwoAuthUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI!);
    fortytwoAuthUrl.searchParams.set('response_type', process.env.NEXT_PUBLIC_RESPONSE_TYPE!);
    return fortytwoAuthUrl.toString();
}

function login() {
    window.location.assign(getIntraAuthUrl());
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
