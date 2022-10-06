import { useRouter } from "next/router";

export default function Logout() {
    const router = useRouter();

    if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        router.push("/");
    }

    return <></>;
}
