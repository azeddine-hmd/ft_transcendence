import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Main from '../components/app/Main'
import Sidebar from '../components/app/Sidebar'
import User_matches from '../components/app/User_matches'
import { Apis } from '../network/apis'
import { ErrorResponse } from '../network/dto/response/error-response.dto'
import { ProfileResponse } from '../network/dto/response/profile-response.dto'
// import { UserResponse } from '../network/dto/user-response.dto'

const Home: NextPage = () => {
  const [isopen, setisopen] = useState(false);
  const [user,setUser] = useState("");
  const [imageUrl, setImageUrl] = useState("");



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
    <div className="homepage flex h-sceen">
      {isopen ? <div className="backgroundblack absolute  top-0 left-0 w-full h-screen bg-black duration-500 opacity-80" style={{transition:"all 0.9 ease"}}>
        
        </div> : null}
      <Sidebar isopen={isopen} setisopen={setisopen} />
      <Main  isopen={isopen}/>
      <User_matches user={user} imageUrl={imageUrl} isopen={isopen}/>
    </div>

  )
}

export default Home;
