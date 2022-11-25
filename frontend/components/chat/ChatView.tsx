import style from '../../styles/chat/ChatView.module.css'
import messages from '../../messages.json'
import ChatCard from './ChatCard';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
    userState: string;
}

interface Props {
    data: props[]
}

var roomID = -1;
var roomTitle = '..';
var roomType:string = '';
var userRole = 'member';
var username = '';
var data = messages;

function Layout() {

    const [text, setText] = useState('');
    const [mdata, setmData] = useState(data);
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
        const handleAdd = () => { 
            socket.emit('addRoleToSomeUser', { username: username, roomId: roomID });
            setShowSetiig(false);
        };

        function handleSave() {
            setShowSetiig(false);
            socket.emit('updateRoom', { privacy: privacy, password: password, roomID: roomID });
        }

        function handleCancel() {
            setShowSetiig(false);
        }


        return (
            <div className={stylee.row}>
                <div className={stylee.column}>
                    <div className={stylee.noHoverCard}>
                        <h3 style={{ "color": "rgba(243, 207, 124, 1)", "marginBottom": "5px", "width": "100%", "textAlign": "center" }}>Setting</h3>
                        <p>make room protected:</p>
                        <label className={settingstyle.toggle}>
                            <input type="checkbox" onChange={handleChange}></input>
                            <span className={settingstyle.slider}></span>
                        </label>
                        {(privacy) ? <><input placeholder="password" className={stylee.input} type="password" onInput={handlePasswordChange}></input><br /></>
                            : <></>}
                        <p>add a user as administrator:</p>
                        <div style={{ "marginTop": "5px", "display": "flex", "justifyContent": "spaceBetween", "height": "30px" }}>
                            <input placeholder="username" className={stylee.input} type="username" onInput={handleUsernameChange}></input><br />
                            <div>
                                <Button onClick={handleAdd} themeColor={"light"} size="small">ADD</Button>
                            </div>
                        </div>
                        <div className={settingstyle.buttonsHolder}>
                            <button onClick={handleSave} className={settingstyle.button}>Save</button>
                            <button onClick={handleCancel} className={settingstyle.button}>Cancel</button>
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
    }, [mdata]);

    const [msg, setMsg] = useState('');

    const handleMessageChange = (event: React.KeyboardEvent<HTMLInputElement>) => { setMsg(event.currentTarget.value); };

    function SendMessage() {
        if (msg !== '')
            (roomType == 'room') ? socket.emit('createMsg', { room: roomID, msg: msg }) : socket.emit('createnNewPrivateMsg', { user: roomTitle, msg: msg });
        setText('');
        setMsg('');
    }

    useEffect(() => {
        socket.on('updateMessages', () => {
            setmData(data);
            scrollToBottom()
        });
        return () => { socket.off('updateMessages'); }
    }, [])

    useEffect(() => {
        setText(msg);
    }, [msg])

    return (
        <div className={style.chat}>
            <div className={style.roomTitle}>
                <h2>{roomTitle}</h2>
                {
                (userRole === 'owner') ?
                <div style={{ "alignSelf": "center", "marginLeft": "10px" }}>
                    <Button onClick={() => setShowSetiig(!showSetting)} themeColor={"light"} size="small">...</Button>
                </div>
                :
                <></>
                }
            </div>
            {(showSetting) ? <Setting /> : <></>}
            <div className={style.chatBoard}>
                <div className={style.scroll}>
                    {(mdata !== undefined) ? mdata.map(messages => {
                        return (
                            <ChatCard id={messages.username} date={messages.date} 
                            name={messages.username} message={messages.msg} avatar={messages.avatar} currentUser={messages.currentUser} 
                            role={userRole} state={messages.userState} room={roomID} />
                        );
                    }) : null}
                    <div ref={bottom}></div>
                </div>
            </div>
            <div className={style.messageBarHolder}>
                <input value={text} autoComplete='off' onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        SendMessage();
                    }
                }} type="text" id={style.messageBar} placeholder="Aa" onInput={handleMessageChange}></input>
                <button id={style.messageBarSendBtn} onClick={SendMessage}>Send</button>
            </div>
        </div>
    );
}

export default function ChatView() {
    const [visible, setVisibility] = useState(false)
    

    useEffect(() => {
        socket.on('addRoleToSomeUser', ({success, error}) => {
            if (success == true)
                alert('user added successfuly');
            else
                alert('Error: ' + error);
            socket.emit('updateMessages', {});    
        })
    
        socket.on("updateRoom", (success, error) => {
            socket.emit('updateMessages', {});
        })
        
        socket.on('clientId', ({ user }) => {
            username = user;
            socket.emit('updateMessages', {});
        })
    
        socket.on('Ban', ({isBaned, user}) => {
            
            if (isBaned && user === username)
            {
                setVisibility(false);
                data = messages
            }
            socket.emit('updateMessages', {});
        });

        socket.on('Kick', ({isKicked, user}) => {
            console.log('kicked', isKicked, user, username);
            
            if (isKicked && user === username)
            {
                setVisibility(false);
                data = messages
            }
            socket.emit('updateMessages', {});
        })
    
        socket.on('createMsg', ({ created, room, tmp }) => {
            
            if (created && room === roomID) {
                
                let newData = [...data];
                let dd = {
                    username: tmp.username,
                    avatar: tmp.avatar,
                    date: tmp.date,
                    msg: tmp.msg,
                    currentUser: tmp.currentUser,
                    userState: tmp.userState,
                }
                newData.push(dd);
                data = newData;
            }
            socket.emit('updateMessages', {});
    
        })
    
        socket.on('receiveNewPrivateMsg', (newDmMsg) => {
            let newData = [...data];
            let dd = {
                username: newDmMsg.username,
                avatar: newDmMsg.avatar,
                date: newDmMsg.date,
                msg: newDmMsg.msg,
                currentUser: newDmMsg.currentUser,
                userState: "none"
            }
            newData.push(dd);
            data = newData;
            socket.emit('updateMessages', {});
        })
    
        
        socket.on('getPrivateMsg', ({ success, error, privateMessages, username, userId }) => {
            roomID = username; // <<<<<<<<<<<<< 8
            roomTitle = username; // <<<<<<<<<<<<<< 8
            setVisibility(true);
            data = privateMessages;
            socket.emit('updateMessages', {});
            
        })

        socket.on('joinRoom', ({ role, room, error, msgs }) => {
            roomType = 'room';
            if (room === -1) {
                alert(error);
            }
            else {
                userRole = role;
                roomType = 'room';
                roomID = room.id;
                roomTitle = room.title;
                setVisibility(true);
                data = msgs;
            }
            socket.emit('updateMessages', {});
        })

        return () => {
            socket.off('addRoleToSomeUser');
            socket.off('updateRoom');
            socket.off('clientId');
            socket.off('Ban');
            socket.off('createMsg');
            socket.off('receiveNewPrivateMsg');
            socket.off('joinRoom');
            socket.off('getPrivateMsg');
        }

    }, [])

    return (
        <>
            {visible ? <Layout /> : null}
        </>
    );
}