import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";
import qrcode from "qrcode";
import { useEffect, useState } from "react";
import { Apis } from "../../network/apis";
import { ErrorResponse } from "../../network/dto/response/error-response.dto";
import { OtpauthuriResponse } from "../../network/dto/response/otpauthuri-response";

export default function Tfa() {
    const router = useRouter();
    const [otpAuth, setOtpAuth] = useState("");
    const [secretField, setSecretField] = useState("");
    const [code, setcode] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        Apis.GetOtpAuthUri({
            onSuccess: (data: OtpauthuriResponse) => {
                setOtpAuth(data.otpauth_uri);
            },
            onFailure: (err: ErrorResponse) => {
                console.log(`GetOtpAuthUri failed: ${err.message}`);
                /* router.push("/signin"); */
            },
        });
    }, [router]);

    useEffect(() => {
        let canvas = document.getElementById("canvas");
        qrcode.toCanvas(canvas, otpAuth, (err) => {
            if (err) console.log(`qrcode error: ${err}`);
            console.log(`qrcode success`);
        });
    }, [otpAuth]);

    return (
        <>
            <Stack
                spacing={4}
                className="h-screen m-8 flex flex-col items-center align-middle"
            >
                <canvas id="canvas"></canvas>
                <Typography variant="body1"  gutterBottom>
                    instruction: scan the Qrcode from Google Authenticator
                    app and submit the generated secret number below
                </Typography>
                <TextField
                    error={error}
                    label="secret"
                    defaultValue=""
                    onChange={(e) => {
                        setcode(e.target.value);
                    }}
                />
                <Button
                    variant="contained"
                    onClick={(e: any) => {
                        Apis.VerifyTfa({
                            code: code,
                            onSuccess: () => {
                              router.push('/home');
                            },
                            onFailure: (err: ErrorResponse) => {
                              setError(true);
                            },
                        });
                    }}
                >
                    Submit
                </Button>
            </Stack>
        </>
    );
}
