import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const access_token = queryParams.get('access_token');
    if (access_token) {
      localStorage.setItem('access_token', access_token);
      router.push('/home');
    } else {
      //TODO: display error for receiving invalid access_token
      alert('received invalid access token')
    }
  })

  return (
    <>
    </>
  );
}
