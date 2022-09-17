import style from '../../styles/chat/ChatCard.module.css'

interface props {
    id : string | undefined;
    name : string | undefined;
    message : string;
    date: string;
    currentUser: boolean;
}

export default function ChatCard({name, message, date, currentUser}:props) {
    return (
        <div className={style.row}>
            <div className={style.column} style={currentUser ? {"float": "right"} : {"float": "left"} }>
                <h4 id={style.username}>{name}</h4>
                <div className={style.chatcard} style={currentUser ? {"backgroundColor": "#04AA6D"} : {"backgroundColor": "#f6f7fb"} }>
                    <p>{message}</p>                    
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}