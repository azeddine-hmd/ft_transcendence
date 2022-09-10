import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('access_token');
    router.push('/');
  })

  return (
    <>
    </>
  );
}
