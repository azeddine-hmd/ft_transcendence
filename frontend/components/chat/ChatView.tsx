import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import React, { useEffect, useRef, useState } from 'react';
import {socket} from '../../pages/chat'

interface props {
    username:string | undefined;
    avatar:string | undefined;
    date:string;
    msg:string;
    currentUser:boolean;
}

interface Props {
    data: props[]
}

var roomID = -1;
var roomTitle ='..';

function Layout({data}:Props) {
    const [text, setText] = useState('');
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
    function SendMessage() { socket.emit('createMsg', {room: roomID, msg: msg}); setText('');}

    useEffect(() => {
        setText(msg);
    }, [msg])

    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
            <h2>{roomTitle}</h2>
            </div>
            <div className={style.chatBoard}>
                <div className={style.scroll}>
                    {(data !== undefined) ? data.map(messages => {
                        return (
                            <ChatCard id={messages.username} date={messages.date} name={messages.username} message={messages.msg} avatar={messages.avatar} currentUser={messages.currentUser} />
                        );
                    }) : null}
                    <div ref={bottom}></div>
                </div>
            </div>
            <div className={style.messageBarHolder}>
                <input value={text} autoComplete='off' onKeyDown={(e) => {
                    if (e.key === 'Enter'){
                        SendMessage();
                        console.log('messgae sent');
                        setText('');
                    }
                }} type="text" id={style.messageBar} placeholder="Aa" onInput={handleMessageChange}></input>
                <button id={style.messageBarSendBtn} onClick={SendMessage}>Send</button>
            </div>
        </div>
    );
}


export default function ChatView() {
    const [data, setData] = useState(messages);
    const [visible, setVisibility] = useState(false)
    
    socket.on('createMsg', ({created, room, tmp}) => {
        console.log("last message " + tmp);
        
        if (created && room === roomID)
        {
            let newData = [...data];
            let dd = {
                username: tmp.username,
                avatar: tmp.avatar,
                date: tmp.date,
                msg: tmp.msg,
                currentUser: tmp.currentUser
            }
            newData.push(dd);
            setData(newData);
        }
        
    })

    socket.on('joinRoom', ({room, msgs}) => {
        console.log('joinRoom flag returned');
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