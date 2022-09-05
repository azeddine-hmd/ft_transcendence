import style from '../../styles/chat/Card.module.css'
import { io } from "socket.io-client";

var socket = io('http://localhost:8080', { transports: ['websocket'] });

interface props {
    title : string;
    description : string;
    members : string;
    id: string;
}

export default function Card({title, description, members, id}:props) {

    function OnCardClicked() {
        socket.emit('joinRoom', {roomId: id, userID: 1});
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
            </div>
        </div>
    );
}