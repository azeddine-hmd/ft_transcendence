import style from '../../styles/chat/Card.module.css'
import {socket} from '../../pages/chat'
import Link from 'next/link';

interface props {
    title : string;
    description : string;
    members : string;
    id: number;
}

export default function Card({title, description, members, id}:props) {

    function OnCardClicked() {
        console.log('send joinRoom flag roomID=', id);
        socket.emit('joinRoom', { roomId: id, privacy: true, password: "" });

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