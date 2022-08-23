import Head from "next/head";
import Loginbtn from "../components/auth/Loginbtn";

function Login() {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Loginbtn/>

        </>
    );
}

function Home() {
  return (
    <div>
      <Login/>
    </div>
  );  
}

export default Home;