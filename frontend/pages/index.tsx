import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loginbtn from "../components/auth/Loginbtn";

function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Loginbtn />
    </>
  );
}

function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      router.push("/home");
    }
  });

  return (
    <div>
      <Login />
    </div>
  );
}

export default Home;
