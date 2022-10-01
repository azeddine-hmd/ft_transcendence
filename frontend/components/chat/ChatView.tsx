import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../../pages/chat/[chat]'
import { Button } from "@progress/kendo-react-buttons";
import settingstyle from '../../styles/chat/Setting.module.css'
import stylee from '../../styles/chat/Card.module.css'



interface props {
    username: string | undefined;
    avatar: string | undefined;
    date: string;
    msg: string;
    currentUser: boolean;
}

interface Props {
    data: props[]
}

var roomID = -1;
var roomTitle = '..';
var roomType = 'DM';
var userID = '';

function Layout({ data }: Props) {
    const [text, setText] = useState('');
    const [showSetting, setShowSetiig] = useState(false);


    function Setting() {
        const [password, setPassword] = useState('');
        const [username, setUsername] = useState('');
        const [privacy, setprivacy] = useState(false);
    
        const handleChange = () => {
    
            setprivacy(!privacy);

    
    
        };
    
        const handlePasswordChange = (event: React.KeyboardEvent<HTMLInputElement>) => { setPassword(event.currentTarget.value); };
        const handleUsernameChange = (event: React.KeyboardEvent<HTMLInputElement>) => { setUsername(event.currentTarget.value); };
        const handleAdd = () => {  };
    
        function handleSave() {
            setShowSetiig(false);
            console.log('privacy=', privacy);
            
            socket.emit('updateRoom', {privacy: privacy, password: password, roomID: roomID});
        }
    
        socket.on("updateRoom", (success, error) => {
            console.log(success, error);
        })

        return (
            <div className={stylee.row}>
                <div className={stylee.column}>
                    <div className={stylee.noHoverCard}>
                        <h3 style={{ "color": "rgba(243, 207, 124, 1)", "marginBottom": "5px" }}>Setting</h3>
                        <p>make room private:</p>
                        <label className={settingstyle.toggle}>
                            <input type="checkbox" onChange={handleChange}></input>
                            <span className={settingstyle.slider}></span>
                        </label>
                        {(privacy) ?
                            <>
                                <input placeholder="password" className={stylee.input} type="password" onInput={handlePasswordChange}></input><br />
                            </>
                            :
                            <></>}
                        <p>add a user as administrator:</p>
                        <div style={{ "display": "flex", "height": "35px" }}>
                            <input placeholder="username" className={stylee.input} type="username" onInput={handleUsernameChange}></input><br />
                            <Button onClick={handleAdd} themeColor={"light"} size="small">ADD</Button>
                        </div>
                        <div className={settingstyle.buttonsHolder}>
                            <button onClick={handleSave} className={settingstyle.button}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
    function SendMessage() {
        (roomType == 'room') ? socket.emit('createMsg', { room: roomID, msg: msg })
        : socket.emit('createnNewPrivateMsg', { user: userID, msg: msg }); setText('');
    }

    useEffect(() => {
        setText(msg);
    }, [msg])

    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
                <h2>{roomTitle}</h2>
                <div style={{ "alignSelf": "center", "marginLeft": "10px" }}>
                    <Button onClick={() => setShowSetiig(!showSetting)} themeColor={"light"} size="small">...</Button>
                </div>
            </div>
            {(showSetting) ? <Setting/> : <></>}
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
                    if (e.key === 'Enter') {
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

    socket.on('createMsg', ({ created, room, tmp }) => {
        console.log("last message " + tmp);

        if (created && room === roomID) {
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

    socket.on('receiveNewPrivateMsg', (newDmMsg) => {

        console.log("hhhhhhhhhjfsljlsjdjl");

        // if (created && room === roomID) // <<<<<

        let newData = [...data];
        let dd = {
            username: newDmMsg.username,
            avatar: newDmMsg.avatar,
            date: newDmMsg.date,
            msg: newDmMsg.msg,
            currentUser: newDmMsg.currentUser
        }
        newData.push(dd);
        setData(newData);


    })

    socket.on('joinRoom', ({ room, msgs }) => {
        roomType = 'room';
        console.log('joinRoom flag returned');
        roomID = room.id;
        roomTitle = room.title;
        setVisibility(true);
        setData(msgs);
    })

    socket.on('getPrivateMsg', ({ success, error, privateMessages, username, userId }) => {
        roomType = 'DM';
        console.log('getPrivateMsg flag returned');
        roomID = username; // <<<<<<<<<<<<< 8
        roomTitle = username; // <<<<<<<<<<<<<< 8
        setVisibility(true);
        setData(privateMessages);
        userID = userId;

    })

    return (
        <>
            {visible ? <Layout data={data} /> : null}
        </>
    );
}