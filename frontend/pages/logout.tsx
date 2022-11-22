import { useRouter } from "next/router";
import { useEffect } from "react";
import { Apis } from "../network/apis";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        Apis.Logout({
            onSuccess: () => {
                router.push("/");
            },
            onFailure: () => {
                router.push("/");
            }
        })
    }, [router]);

    return <></>;
}
