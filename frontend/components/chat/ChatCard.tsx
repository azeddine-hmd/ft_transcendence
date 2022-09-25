import { width } from '@mui/system';
import Link from 'next/link';
import style from '../../styles/chat/ChatCard.module.css'

interface props {
    id : string | undefined;
    name : string | undefined;
    message : string;
    date: string;
    avatar: string | undefined;
    currentUser: boolean;
}

export default function ChatCard({name, message, date, avatar, currentUser}:props) {
    return (
        <div className={style.row}>
            <div className={style.column} style={currentUser ? {"float": "right"} : {"float": "left"} }>
                <div style={{ "display": "flex", "justifyContent": "spaceBetween"}}>
                    <img src={avatar} style={{ "marginTop": "4px", "width": "40px", "height": "40px", "borderRadius": "50px"}} />
                    <span id={style.username}>{name}</span>
                </div>
                <div className={style.chatcard} style={currentUser ? {"backgroundColor": "#04AA6D"} : {"backgroundColor": "#f6f7fb"} }>
                    <p>{message}</p>                    
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}