import { url } from "inspector";
import style from "../../styles/app/Main.module.css"

export default function Main({isopen} :any) {
    return (
        <>
        
            <div className={`gif bg-slate-400 w-[70%] h-full rounded-r-3xl relative`} style={{borderRadius:"0 123px 123px 0",background:isopen? "black":"none"}}>
                <img className={`w-[100%] h-[100%] opacity-30 relative ${style.uploadvd}`} style={{opacity:isopen?".5":"1"}} src="https://cdn.dribbble.com/users/648290/screenshots/3865740/media/b6ac7006c2319b336c9caebc2bfeeee4.gif" alt="" />
                <div className="play flex ">
                <button className={`absolute left-[38%] bottom-[12%] ${style.btnplaynow}`}>Play Now</button>
                </div>
            </div>
        </>
    );
}