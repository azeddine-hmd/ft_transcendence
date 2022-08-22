import style from '../../styles/chat/ChatView.module.css'
import Card from './ChatCard';
import messages from '../../messages.json'
import ChatCard from './ChatCard';

interface props {
    id: string;
    name: string;
    message: string;
    date: string;
}
const data: props[] = messages;

export default function ChatView() {
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