import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "../../../utils/cookie";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      router.push("/home");
    } else {
      //TODO: display error for receiving invalid access_token
      alert("received invalid access token");
    }
  }, [router]);

  return <></>;
}
