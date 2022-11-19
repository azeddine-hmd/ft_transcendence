import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
      router.push("/home");
  }, [router]);

  return <></>;
}
