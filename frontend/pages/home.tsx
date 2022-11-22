import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../components/profile/Sidebar";
import Useravatar from "../components/profile/Useravatar";
import { Apis } from "../network/apis";
import { ErrorResponse } from "../network/dto/response/error-response.dto";
import { ProfileResponse } from "../network/dto/response/profile-response.dto";

const Home: NextPage = () => {
  const router = useRouter();
  const [isopen, setisopen] = useState(false);
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    Apis.CurrentProfile({
      onSuccess: (userResponse: ProfileResponse) => {
        console.log(userResponse);
        setUsername(userResponse.username);
        setImageUrl(userResponse.avatar);
        console.log(userResponse.avatar);
        userResponse.username;
      },
      onFailure: (err: ErrorResponse) => {
        if (err.statusCode === 401) {
          router.push("/signin");
        }
      },
    });
  }, [router]);

  return (
    <div className="homepage overflow-y-scroll h-full w-full  min-w-full relative">
      <img
        src="/profile/bg.png"
        className="  w-full h-screen min-w-full "
        alt=""
      />
      <div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
      <div className="contain absolute  top-0 w-full h-screen flex justify-between">
        <div className="sidebarsize top-0  ">
          <Sidebar />
        </div>
        <div className="contentss w-full  h-screen  flex-col ">
          <Useravatar avata={imageUrl} userid={username} />
        </div>
      </div>
    </div>
  );
};

export default Home;
