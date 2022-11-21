import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import Sidebar from "../components/profile/Sidebar";
import Useravatar from "../components/profile/Useravatar";
import { Apis } from "../network/apis";
import { ErrorResponse } from "../network/dto/response/error-response.dto";
import { ProfileResponse } from "../network/dto/response/profile-response.dto";

export default function Game() {
    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const router = useRouter();

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
    }), [router];

    return (
        <>
            <div className="homepage w-full h-full min-w-full relative">
                <img
                    src="/profile/bg.png"
                    className="  w-full h-full min-w-full "
                    alt=""
                />
                <div className="bgopaci absolute top-0 opacity-90 left-0 w-full h-full  min-w-full  bg-[#463573] "></div>
                <div className="contain absolute top-0 w-full h-full flex justify-between">
                    <Sidebar />
                    <div className="contentss w-full  h-full py-24 px-24 lg:px-15 mx-16 xl:px-28 flex-col ">
                        <Useravatar
                            avata={imageUrl}
                            userid={username}
                        />

                        <h1>data</h1>
                    </div>
                </div>
            </div>
        </>
    );
}
