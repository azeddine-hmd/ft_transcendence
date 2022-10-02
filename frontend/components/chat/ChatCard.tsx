import "@progress/kendo-theme-default/dist/all.css";
import { integerPropType } from '@mui/utils';
import Router from "next/router";
import style from '../../styles/chat/ChatCard.module.css'
import { DropDownButton, DropDownButtonItemClickEvent } from "@progress/kendo-react-buttons";


interface props {
    id: string | undefined;
    name: string | undefined;
    message: string;
    date: string;
    avatar: string | undefined;
    currentUser: boolean;
}


export default function ChatCard({ name, message, date, avatar, currentUser }: props) {

    const Menu = () => {

        const items = [
            "Profile",
            "Message",
            "Block",
            "Invite to game",
        ];

        function handleItemClick(event:DropDownButtonItemClickEvent) {
            if (event.item === "Profile"){
                Router.push("/user/"+name);
            }
            else if (event.item === "Message"){
                
            }
            else if (event.item === "Block"){

            }
            else if (event.item === "Invite to game"){

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
                    <Menu />
                </div>

                <div className={style.chatcard} style={currentUser ? { "backgroundColor": "#04AA6D" } : { "backgroundColor": "#f6f7fb" }}>
                    <p>{message}</p>
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}