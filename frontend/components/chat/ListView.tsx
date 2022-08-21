import Card from "./Card";
import rooms from '../../rooms.json'
import style from '../../styles/chat/ListView.module.css'

interface props {
    title: string;
    description: string;
    members: string;
    uri: string;
}

const data: props[] = rooms;

export default function ListView() {
    return (
        <div className={style.list}>
            <div className={style.buttonsHolder}>
                <button className={style.button}>Rooms</button>
                <button className={style.button}>DM</button>
            </div>
            <input className={style.searchBar} type="text" placeholder="Search.."></input>
            <div className={style.scroll}>
                {data.map(room => {
                    return (
                        <Card title={room.title} description={room.description} members={room.members} uri={room.uri} />
                    );
                })}
            </div>
            <div className={style.buttonsHolder}>
                <button className={style.button}>Create New Room</button>
            </div>
        </div>

    );
}