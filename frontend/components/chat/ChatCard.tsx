import "@progress/kendo-theme-default/dist/all.css";
import {socket} from '../../pages/chat/[chat]'
import Router from "next/router";
import style from '../../styles/chat/ChatCard.module.css'
import { DropDownButton, DropDownButtonItemClickEvent } from "@progress/kendo-react-buttons";
import { useState } from "react";
import { HiSpeakerXMark } from "react-icons/hi2";
import { GiBootKick } from "react-icons/gi";
import { ImBlocked } from "react-icons/im";




interface props {
    id: string | undefined;
    name: string | undefined;
    message: string;
    date: string;
    avatar: string | undefined;
    currentUser: boolean;
    role: string;
    state: string;
    room: number;
}



export default function ChatCard({ name, message, date, avatar, currentUser, role, state, room }: props) {

    const [isMuteMenu, setMuteMenu] = useState(false);
    const [isBanMenu, setBanMenu] = useState(false);
    const [isKickMenu, setKickMenu] = useState(false);

    
    function Ban() {
        function T1() { socket.emit('Ban', {time :"T1", user: name, room: room} ); setBanMenu(false); };
        function T2() { socket.emit('Ban', {time :"T2", user: name, room: room} ); setBanMenu(false); };
        function T3() { socket.emit('Ban', {time :"T3", user: name, room: room} ); setBanMenu(false); };
        function Cancel() { setBanMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Ban for : </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={T1}>1H</button>
                    <button id={style.messageBarSendBtn} onClick={T2}>3H</button>
                    <button id={style.messageBarSendBtn} onClick={T3}>10H</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }
    
    function Kick() {
        function Confirm() { socket.emit('Kick', {user: name}); setKickMenu(false); };
        function Cancel() { setKickMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Do you want to kick this user? </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={Confirm}>Kick</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }

    function TimePop() {
        function T1() { socket.emit('Mute', {time :"T1", user: name, room: room} ); setMuteMenu(false); };
        function T2() { socket.emit('Mute', {time :"T2", user: name, room: room} ); setMuteMenu(false); };
        function T3() { socket.emit('Mute', {time :"T3", user: name, room: room} ); setMuteMenu(false); };
        function Cancel() { setMuteMenu(false); };
        return (
            <div  className={style.chatcard} style={{"margin": "0px 0px 10px 0px", "padding":"5px"}}>
                <p style={{"fontSize":"14px", "marginLeft":"8px"}}>Mute for: </p>
                <div style={{"display": "flex" }}>
                    <button id={style.messageBarSendBtn} onClick={T1}>1H</button>
                    <button id={style.messageBarSendBtn} onClick={T2}>3H</button>
                    <button id={style.messageBarSendBtn} onClick={T3}>10H</button>
                    <button id={style.messageBarSendBtn} onClick={Cancel}>Cancel</button>
                </div>
            </div>
        );
    }

    const Menu = () => {
        
        var items = [
            "Profile",
            "Message",
            "Block",
            "Invite to game",
            "Mute",
            "Ban",
            "Kick"
        ];

        if (role === 'member')
        {
            items.pop();
            items.pop();
            items.pop();
        }

        socket.on('blockUser', (isBlocked) => {
            if (isBlocked)
                items[2] = 'Unblock';
        })
        
        socket.on('unblockUser', (isBlocked) => {
            if (isBlocked)
                items[2] = 'Block';
        })

        function handleItemClick(event:DropDownButtonItemClickEvent) {
            if (event.item === "Profile"){
                Router.push("/user/"+name);
            }
            else if (event.item === "Message"){
                Router.push("/chat/" + name);
                socket.emit('conversation');
            }
            else if (event.item === "Block"){
                if (items[2] == 'Block')
                    socket.emit('blockUser', {user: name});
                else
                    socket.emit('unblockUser', {user: name});
            }
            else if (event.item === "Invite to game"){

            }
            else if (event.item === "Mute"){
                setMuteMenu(true);
            }
            else if (event.item === "Ban"){
                setBanMenu(true);
            }
            else if (event.item === "Kick"){
                setKickMenu(true);
            }
            else {
                console.log(event.item);
            }
        }

        return (
            <div style={{ "alignSelf": "center", "marginLeft": "10px" }}>
                <DropDownButton
                    popupSettings={{
                        animate: false,
                        popupClass: "my-popup",
                    }}
                    items={items}
                    text="..."
                    size="small"
                    onItemClick={handleItemClick}
                />
            </div>
        );
    };

    return (
        <div className={style.row}>
            <div className={style.column} style={currentUser ? { "float": "right" } : { "float": "left" }}>

                { (isMuteMenu) ? <TimePop /> : <></> }
                { (isBanMenu) ? <Ban /> : <></> }
                { (isKickMenu) ? <Kick /> : <></> }
                <div style={{"display": "flex", "justifyContent": "spaceBetween", "alignItems":"center"}}>
                    <img src={avatar} style={{ "marginTop": "4px", "width": "40px", "height": "40px", "borderRadius": "50px" }} />
                    <span id={style.username}>{name}</span>
                    { (state == 'blocked') ? <ImBlocked style={{"marginLeft":"5px", "filter":"invert(12%) sepia(97%) saturate(5624%) hue-rotate(358deg) brightness(104%) contrast(114%)"}}/> : <></>}
                    { (state == 'muted') ? <HiSpeakerXMark style={{"marginLeft":"5px"}}/> : <></>}
                    { (state == 'kicked') ? <GiBootKick style={{"marginLeft":"5px"}}/> : <></>}
                    {(!currentUser) ? <Menu /> : <></>}
                </div>

                <div className={style.chatcard} style={currentUser ? { "backgroundColor": "#04AA6D" } : { "backgroundColor": "#f6f7fb" }}>
                    <p>{message}</p>
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}