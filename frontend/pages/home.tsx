
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Main from '../components/app/Main'
// import Sidebar from '../components/app/Sidebar'
import User_matches from '../components/app/User_matches'
import { Apis } from '../network/apis'
import { ErrorResponse } from '../network/dto/response/error-response.dto'
import { ProfileResponse } from '../network/dto/response/profile-response.dto'
import Useravatar from '../components/profile/Useravatar'
// import { UserResponse } from '../network/dto/user-response.dto'
import Sidebar from '../components/profile/Sidebar'

const Home: NextPage = () => {
    const [isopen, setisopen] = useState(false);
    const [user, setUser] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        Apis.CurrentProfile({
            onSuccess: (userResponse: ProfileResponse) => {
                console.log(userResponse);
                setUser(userResponse.username);
                setImageUrl(userResponse.avatar);
                console.log(userResponse.avatar);
                userResponse.username;
            },
            onFailure: (err: ErrorResponse) => {
                alert("couldn't fetch user");
            },
        });
    });


  useEffect(() => {

    Apis.CurrentProfile({
      onSuccess: (userResponse: ProfileResponse) => {
        console.log(userResponse);
        setUser(userResponse.username);
        setImageUrl(userResponse.avatar);
        console.log(userResponse.avatar);
        userResponse.username
      },
      onFailure: (err: ErrorResponse) => {
        alert("couldn't fetch user");
      }
    })

  });

  return (
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

  )
}

export default Home;
