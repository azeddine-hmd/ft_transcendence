import style from '../../styles/chat/Card.module.css'
import style2 from '../../styles/chat/ListView.module.css'
import {socket} from '../../pages/chat'
import Link from 'next/link';

interface props {
    title : string;
    description : string;
    members : string;
    id: number;
    privacy: boolean;
}

let showPass = false;

export default function Card({title, description, members, id, privacy}:props) {

    function OnCardClicked() {
        console.log('send joinRoom flag roomID=', id);
        showPass = privacy;
        if (!privacy)
            socket.emit('joinRoom', { roomId: id, privacy: false, password: "" });
    }

    function passClick() {
        socket.emit('joinRoom', { roomId: id, privacy: true, password: "" });
        showPass = false;
    }

    return (
        <div className={style.row}>
            <div className={style.column}>
                <div className={style.card}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <h5 id={style.Counter}>{members}</h5>
                    <a onClick={OnCardClicked} key="uniqueId1"></a>
                </div>
                {
                (showPass) ?
                <div className={style.card}>
                    <input type="password" placeholder='Entre Password' style={{"width":"100%", "margin":"5px"}}></input>
                    <button onClick={passClick} className={style2.button} style={{"width":"100%", "margin":"5px"}}>Entre</button>
                </div>
                : <></>}
            </div>
        </div>
    );
}