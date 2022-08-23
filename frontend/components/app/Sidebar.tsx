import Link from "next/link";
import style from "../../styles/app/Sidebar.module.css"
export default function Sidebar() {
    return (
        <div className={style.sidebar}>
            <div className="Logo">
                <h2>Logo</h2>
                {/* <img src="" alt="" /> */}
            </div>
            <ul className="menu">
                <li>
                    <Link href="/">
                    <a>Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                    <a>Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                    <a>Home</a>
                    </Link>
                </li>
                <li>
                    <Link href="/">
                    <a>Home</a>
                    </Link>
                </li>
            </ul>
            <div className="btn_logout">
                <a href="">Log Out</a>
            </div>
        </div>
    );
}