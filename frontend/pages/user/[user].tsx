import Sidebar from "../../components/app/Sidebar";
import ProfileM from "../../components/profile/Profilem";
import { useState } from "react";
import { useRouter } from "next/router";

export default function user(){
        const router = useRouter();
        const userid = router.query.user;
         const [isopen, setisopen] = useState(false);

        return (
            <>
            <p>{userid}</p>

          {/* <div className="homepage flex ">
            {isopen ? <div className="backgroundblack absolute  top-0 left-0 w-full h-screen bg-black duration-500 opacity-80" style={{transition:"all 0.9 ease"}}>
              
              </div> : null}
            <Sidebar isopen={isopen} setisopen={setisopen} />
            <ProfileM/>
          </div> */}
        </>
        )

}