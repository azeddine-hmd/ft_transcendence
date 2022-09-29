import axios, { AxiosError } from "axios";
import { AddFriendDto } from "./dto/payload/add-friend.dto";
import { SigninDto } from "./dto/payload/signin.dto";
import { SignupDto } from "./dto/payload/signup.dto";
import { ErrorResponse } from "./dto/response/error-response.dto";
import { FriendsResponse } from "./dto/response/friends-response.dto";
import { ProfileResponse } from "./dto/response/profile-response.dto";
import { RelationResponse } from "./dto/response/relation-response.dto";
import { SigninResponse } from "./dto/response/signin-response.dto";
import { localService } from "./local.service";

export namespace Apis {
  export async function Signin(options: {
    signDto: SigninDto;
    onSuccess: (data: SigninResponse) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.post<SigninResponse>(
        "api/auth/signin",
        options.signDto
      );
      localStorage.setItem("access_token", res.data.access_token);
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
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
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.post("api/auth/signup", options.signupDto);
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function CurrentProfile(options: {
    onSuccess: (profile: ProfileResponse) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.get<ProfileResponse>("api/profiles");
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
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
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      await localService.get("/api/auth/logout");
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function Verify(options: {
    onSuccess: () => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      await localService.get("/api/auth/verify");
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function AddFriend(options: {
    addFriendDto: AddFriendDto,
    onSuccess: () => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      await localService.get("/api/users/relations/friend");
      return options.onSuccess();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function getFriends(options: {
    onSuccess: (friends: FriendsResponse[]) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.get<FriendsResponse[]>("/api/users/relations/friends");
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }

  export async function getRelation(options: {
    username: string;
    onSuccess: (relation: RelationResponse) => void;
    onFailure: (err: ErrorResponse) => void;
  }) {
    try {
      const res = await localService.get<RelationResponse>(`/api/users/relations`, {
        params: {
          username: options.username,
        },
      });
      return options.onSuccess(res.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<ErrorResponse>;
        if (error && error.response && error.response.data) {
          return options.onFailure(error.response.data);
        }
      }
    }
    return options.onFailure({ message: "something went wrong!" });
  }
}
