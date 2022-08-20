import style from '../../styles/chat/ChatCard.module.css'

interface props {
    id : string;
    name : string;
    message : string;
    date: string;
}

export default function ChatCard({name, message, date}:props) {
    return (
        <div className={style.row}>
            <div className={style.column}>
                <h4 id={style.username}>{name}</h4>
                <div className={style.chatcard}>
                    <p>{message}</p>                    
                </div>
                <p id={style.date}>{date}</p>
            </div>
        </div>
    );
}