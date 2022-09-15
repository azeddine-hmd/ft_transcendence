import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import { useState } from 'react';
import {socket} from '../../pages/chat'

interface props {
    id: string;
    name: string;
    message: string;
    date: string;
    roomID: string;
    roomTitle: string;
}

interface Props {
    data: props[]
}

var roomID = -1;

function Layout({data}:Props) {
    const [msg, setMsg] = useState('');
    const handleMessageChange = (event: React.KeyboardEvent<HTMLInputElement>) => { setMsg(event.currentTarget.value); };
    function SendMessage() { socket.emit('createMsg', {room: roomID, msg: msg}); }

    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
            <h2>{(data !== undefined) ? data[0].roomTitle : ".."}</h2>
            </div>
            <div className={style.chatBoard}>
                <div className={style.scroll}>
                    {(data !== undefined) ? data.map(messages => {
                        return (
                            <ChatCard id={messages.id} date={messages.date} name={messages.name} message={messages.message} />
                        );
                    }) : null}
                </div>
            </div>
            <div className={style.messageBarHolder}>
                <input type="text" id={style.messageBar} placeholder="Aa" onInput={handleMessageChange}></input>
                <button id={style.messageBarSendBtn} onClick={SendMessage}>Send</button>
            </div>
        </div>
    );
}


export default function ChatView() {
    const [data, setData] = useState(messages);
    const [visible, setVisibility] = useState(false)
    
    socket.on('createMsg', ({created, newmsg}) => {
        
    })

    socket.on('joinRoom', ({roomId, msg}) => {
        roomID = roomId;
        console.log(roomID);
        
        setVisibility(true);
        setData(msg);
    })

    return (
        <>
            {visible ? <Layout data={data} /> : null}
        </>
    );
}