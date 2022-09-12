import axios, { AxiosError } from "axios";
import { User } from "../../model/user";
import { ErrorResponse } from "../dto/error-response.dto";
import { LoginResponse } from "../dto/login-response.dto";
import { localService } from "../local.service";

export class Api {
    static async login(args: {
        user: User;
        onSuccess: () => void;
        onFailure: (err: ErrorResponse) => void;
    }) {
        try {
            const res = await localService.post<LoginResponse>(
                "/auth/login",
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

    static async register(args: {
        user: User;
        onSuccess: (user: User) => void;
        onFailure: (err: ErrorResponse) => void;
    }) {
        try {
            const res = await localService.post<User>(
                "/auth/register",
                args.user
            );
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

    static async fetchUsername(args: {
        onSuccess: (user: User) => void;
        onFailure: (err: ErrorResponse) => void;
    }) {
        try {
            const res = await localService.get<User>("/app/me");
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

    static async autherizeFortytwo(args: {
        onSuccess: (data: any) => void;
        onFailure: (err: ErrorResponse) => void;
    }) {
        try {
            const res = await axios.get(
                "https://api.intra.42.fr/oauth/authorize",
                {
                    params: {
                        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
                        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
                        response_type: process.env.NEXT_PUBLIC_RESPONSE_TYPE,
                    },
                    headers: {
                            'Sec-Fetch-Modes': 'no-cors',
                    },
                }
            );
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
}
