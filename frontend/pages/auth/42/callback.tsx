import { Cookies } from "next/dist/server/web/spec-extension/cookies";
import { Router, useRouter } from "next/router";
import { useEffect } from "react";

function getCookie(cookieName: string): string | null {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if ((c.indexOf(name)) == 0) {
            return c.substr(name.length);
        }

    }
    return null;
}

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const cookies = document.cookie;
    console.log(cookies);
    const queryParams = new URLSearchParams(window.location.search)
    const access_token = queryParams.get('access_token');
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      router.push('/home');
    } else {
      //TODO: display error for receiving invalid access_token
      alert('received invalid access token')
    }
  }, []);

  return (
    <>
    </>
  );
}
