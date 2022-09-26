
import Sidebar from '../components/profile/Sidebar'
import Useravatar from '../components/profile/Useravatar'

export default function Game() {
    return (
        <>
         <div className="homepage w-full h-screen min-w-full relative">
      <img src="/profile/bg.png" className="  w-full h-full min-w-full " alt="" />
        <div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
        <div className="contain absolute top-0 w-full h-screen flex justify-between">
            <Sidebar/>
            <div className="contentss w-full  h-screen py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
              <Useravatar avata={"/profile/Avatar.png"} userid={"amine ajdahim"} />
          </div>
        </div>

    </div>

        </>
    );
}