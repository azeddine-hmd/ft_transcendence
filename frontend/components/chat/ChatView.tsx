import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import { useState } from 'react';
import { io } from "socket.io-client";

var socket = io('http://localhost:8080', { transports: ['websocket'] });

interface props {
    id: string;
    name: string;
    message: string;
    date: string;
}

interface Props {
    data: props[]
}

function Layout({data}:Props) {
    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
            <h2>Lobby😃</h2>
            </div>
            <div className={style.chatBoard}>
                <div className={style.scroll}>
                    {data.map(messages => {
                        return (
                            <ChatCard id={messages.id} date={messages.date} name={messages.name} message={messages.message} />
                        );
                    })}
                </div>
            </div>
            <div className={style.messageBarHolder}>
                <input type="text" id={style.messageBar} placeholder="Aa"></input>
                <button id={style.messageBarSendBtn}>Send</button>
            </div>
        </div>
    );
}


export default function ChatView() {
    const [data, setData] = useState(messages);
    const [visible, setVisibility] = useState(false)
    // on card clicked setVisibility(true);
    socket.on('joinRoom', (data:props[]) => {
        setVisibility(true);
        setData(data);
    })

    return (
        <div>
            {visible ? <Layout data={data} /> : null}
        </div>
    );
}