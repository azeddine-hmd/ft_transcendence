import axios, { AxiosError } from "axios";
import { User } from "../model/user";
import { ErrorResponse } from "./dto/error-response.dto";
import { LoginResponse } from "./dto/login-response.dto";
import { UserResponse } from "./dto/user-response.dto";
import { localService } from "./local.service";

export namespace Apis {
  export async function Signin(args: {
    user: User;
    onSuccess: (data: LoginResponse) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.post<LoginResponse>(
        "api/auth/login",
        args.user
      );
      localStorage.setItem("access_token", res.data.access_token);
      return args.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return args.onFailure(error.response.data);
        }
      }
    }
    return args.onFailure({ message: "something went wrong!" });
  }

  export async function Register(args: {
    user: User;
    onSuccess: (user: User) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.post<User>("api/auth/register", args.user);
      return args.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return args.onFailure(error.response.data);
        }
      }
    }
    return args.onFailure({ message: "something went wrong!" });
  }

  export async function fetchUser(args: {
    onSuccess: (user: UserResponse) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.get<UserResponse>("api/users");
      return args.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return args.onFailure(error.response.data);
        }
      }
    }
    return args.onFailure({ message: "something went wrong!" });
  }

  export async function autherizeFortytwo() {
    const authenticationUrl = process.env.NEXT_PUBLIC_API_BASE_URL + "/api/auth/intra";
    console.log(`redirecting to: ${authenticationUrl.toString()}`);
    window.location.assign(authenticationUrl);
  }
}
