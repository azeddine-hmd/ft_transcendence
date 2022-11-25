import qrcode from 'qrcode';
import { useEffect, useState } from 'react';
import { Apis } from '../../network/apis';
import { ErrorResponse } from '../../network/dto/response/error-response.dto';
import { OtpauthuriResponse } from '../../network/dto/response/otpauthuri-response';

export default function Tfa() {
  const [otpAuth, setOtpAuth] = useState("");

  useEffect(() => {
    Apis.GetOtpAuthUri({
      onSuccess: (data: OtpauthuriResponse) => {
        setOtpAuth(data.otpauth_uri);
      },
      onFailure: (err: ErrorResponse) => {
        console.log(`GetOtpAuthUri failed: ${err.message}`);
      }
    });
  }, []);

  useEffect(() => {
    let canvas = document.getElementById('canvas');
    qrcode.toCanvas(canvas, otpAuth, (err) => {
      if (err) console.log(`qrcode error: ${err}`);
      console.log(`qrcode success`);
    });
  }, [otpAuth]);

  return (
    <>
      <div>
        <p><strong>Tfa Page</strong></p>
        <canvas id="canvas"></canvas>
      </div>
    </>
  );
}
