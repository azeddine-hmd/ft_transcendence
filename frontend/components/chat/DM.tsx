import style from '../../styles/chat/Card.module.css'
import {socket} from '../../pages/chat/[chat]'
import Link from 'next/link';
import Router from "next/router";

interface props {
    userId:string | undefined;
    username:string | undefined;
    avatar:string | undefined;
    displayName: string | undefined;
}

export default function DM({displayName, username, userId, avatar}:props) {

    function OnCardClicked() {
        Router.push("/chat/" + username);
        socket.emit('conversation');
        console.log('getPrivateMsg SENT');
    }

    return (
        <div className={style.row}>
            <div className={style.column}>
                <div className={style.card} style={{ "display": "flex", "justifyContent": "spaceBetween", "padding": "10px"}} >
                    <div style={{ "display": "flex", "justifyContent": "spaceBetween", "marginRight": "10px"}}>
                        <img src={avatar} style={{ "marginTop": "4px", "width": "40px", "height": "40px", "borderRadius": "50px"}} />
                    </div>
                    <div>
                        <h3>{displayName}</h3>
                        <p style={{"fontSize": "12px"}} >{username}</p>
                        <a onClick={OnCardClicked} key="uniqueId1"></a>
                    </div>
                </div>
            </div>
        </div>
    );
}