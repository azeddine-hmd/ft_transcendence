import style from '../../styles/chat/Card.module.css'

interface props {
    title : string;
    description : string;
    members : string;
    uri: string;
}

export default function Card({title, description, members, uri}:props) {
    return (
        <div className={style.row}>
            <div className={style.column}>
                <div className={style.card}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <h5 id={style.Counter}>{members}</h5>
                    <a href={uri}></a>
                </div>
            </div>
        </div>
    );
}