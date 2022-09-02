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
    useEffect(() => {
        if (localStorage.getItem('access_token'))
            router.push('/home');
    });
  return (
    <div>
      <Login/>
    </div>
  );  
}

export default Home;
