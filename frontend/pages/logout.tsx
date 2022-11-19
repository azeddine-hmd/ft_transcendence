import { useRouter } from "next/router";

export default function Logout() {
    const router = useRouter();

    if (typeof window !== "undefined") {
        //TODO: remove all cookeis if possible
    }

    return <></>;
}
