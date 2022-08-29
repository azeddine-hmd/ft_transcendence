import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Callback() {
  const router = useRouter();
  function handltest()
  {
    router.push('/home');
  }
  return (
    <>
      <h1 onClick={handltest}>callback</h1>
      <Link href={'/home'}><Button>Go Home</Button></Link>
    </>
  );
}
