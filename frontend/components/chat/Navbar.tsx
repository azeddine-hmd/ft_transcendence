import style from '../../styles/chat/Navbar.module.css'

function NavBar() {
    return (
        <div className={style.topnav}>
            <a className={style.active} href="">Game</a>
            <a href="">Chat Rooms</a>
            <a href="">Profile</a>
        </div>
    )
}

export default NavBar;