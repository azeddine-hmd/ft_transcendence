import style from "../../styles/auth/Loginbtn.module.css"
import { useRouter } from 'next/router'

export default function Loginbtn() {
    const router = useRouter();
    function handlebutton() {
        alert('button pressed');
    }
    return (
        <div className={style.btn_login}>
            <button onClick={handlebutton}>Login</button>
        </div>
    );
}