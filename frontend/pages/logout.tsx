import { useRouter } from "next/router";
import { useEffect } from "react";
import { Apis } from "../network/apis";
import { ErrorResponse } from "../network/dto/response/error-response.dto";

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        Apis.Logout({
            onSuccess: () => {
                router.push("/");
            },
            onFailure: (err: ErrorResponse) => {
                // alert('msa7 cookies');
                router.push('/');
            }
        })
    }, [router]);

    return <></>;
}
