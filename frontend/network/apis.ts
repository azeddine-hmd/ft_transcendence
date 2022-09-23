import axios, { AxiosError } from "axios";
import { SigninDto } from "./dto/payload/signin.dto";
import { SignupDto } from "./dto/payload/signup.dto";
import { ErrorResponseDto } from "./dto/response/error-response.dto";
import { SigninResponseDto } from "./dto/response/signin-response.dto";
import { localService } from "./local.service";

export namespace Apis {
  export async function Signin(options: {
    signDto: SigninDto;
    onSuccess: (data: SigninResponseDto) => void;
    onFailure: (err: ErrorResponseDto) => void;
  }) {
    try {
      const res = await localService.post<SigninResponseDto>(
        "api/auth/signin",
        options.signDto
      );
      localStorage.setItem("access_token", res.data.access_token);
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponseDto>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function SignUp(options: {
    signupDto: SignupDto;
    onSuccess: () => void;
    onFailure: (err: ErrorResponseDto) => void;
  }) {
    try {
      const res = await localService.post("api/auth/signup", options.signupDto);
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponseDto>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function CurrentProfile(options: {
    onSuccess: (profile: ProfileResponseDto) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.get<ProfileResponseDto>("api/profiles");
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponseDto>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function autherizeFortytwo() {
    const authenticationUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/intra";
    window.location.assign(authenticationUrl);
  }

  export async function Logout(options: {
    onSuccess: () => void;
    onFailure: (err: ErrorResponseDto) => void;
  }) {
    try {
      await localService.get("/api/auth/logout");
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponseDto>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }
}