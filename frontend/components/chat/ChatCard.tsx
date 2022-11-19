import "@progress/kendo-theme-default/dist/all.css";
import {socket} from '../../pages/chat/[chat]'
import Router from "next/router";
import style from '../../styles/chat/ChatCard.module.css'
import { DropDownButton, DropDownButtonItemClickEvent } from "@progress/kendo-react-buttons";
import { useState } from "react";
import { on } from "stream";


interface props {
    id: string | undefined;
    name: string | undefined;
    message: string;
    date: string;
    avatar: string | undefined;
    currentUser: boolean;
    role: string;
}


export default function ChatCard({ name, message, date, avatar, currentUser, role }: props) {

    const Menu = () => {
        
        var items = [
            "Profile",
            "Message",
            "Block",
            "Invite to game",
            "Mute",
            "Ban"
        ];

        if (role === 'member')
        {
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
                
            }
            else if (event.item === "Ban"){

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

                <div style={{ "display": "flex", "justifyContent": "spaceBetween" }}>
                    <img src={avatar} style={{ "marginTop": "4px", "width": "40px", "height": "40px", "borderRadius": "50px" }} />
                    <span id={style.username}>{name}</span>
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