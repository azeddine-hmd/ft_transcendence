import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import React, { useEffect, useRef, useState } from 'react';
import {socket} from '../../pages/chat'

interface props {
    msg: string;
    user: { id: number, name: string };
}

interface Props {
    data: props[]
}

var roomID = -1;
var roomTitle ='..';

function Layout({data}:Props) {
    const bottom = useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (bottom.current)
            bottom.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(() => {
        scrollToBottom()
    }, [data]);
    const [msg, setMsg] = useState('');
    const handleMessageChange = (event: React.KeyboardEvent<HTMLInputElement>) => { setMsg(event.currentTarget.value); };
    function SendMessage() { socket.emit('createMsg', {room: roomID, msg: msg}); }

    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
            <h2>{roomTitle}</h2>
            </div>
            <div className={style.chatBoard}>
                <div className={style.scroll}>
                    {(data !== undefined) ? data.map(messages => {
                        return (
                            <ChatCard id={messages.user.id.toString()} date={'messages.date'} name={messages.user.name} message={messages.msg} />
                        );
                    }) : null}
                    <div ref={bottom}></div>
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
        console.log('** A Message has been added to the DATABASE ** Created=', created, ' newmsg=', newmsg);
        if (created)
        {
            let newData = [...data];
            let dd = {
                msg: newmsg,
                user: { id: +socket.id, name: "string" }
            }
            newData.push(dd);
            setData(newData);
        }
        
    })

    socket.on('joinRoom', ({room, msgs}) => {
        roomID = room.id;
        roomTitle = room.title;
        setVisibility(true);
        setData(msgs);
    })

    return (
        <>
            {visible ? <Layout data={data} /> : null}
        </>
    );
}