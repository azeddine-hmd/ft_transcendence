import { useRouter } from "next/router";
import { Apis } from "../network/apis";
import { ErrorResponse } from "../network/dto/response/error-response.dto";

export default function Logout() {
    const router = useRouter();

    if (typeof window !== "undefined") {
        Apis.Logout({
            onSuccess: () => {
                localStorage.removeItem("access_token");
                router.push("/");
            },
            onFailure: (err: ErrorResponse) => {
                alert(`failed to logout. reason: ${err.message}`);
                localStorage.removeItem("access_token");
                router.push("/");
            },
        });
    }

    return <></>;
}
