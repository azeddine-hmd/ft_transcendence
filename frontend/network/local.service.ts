import axios, { AxiosResponse } from "axios";

export const localService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// intercept local service requests
localService.interceptors.request.use((config) => {
    if (config) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }
    }
    return config;
});

// intercept local service responses
localService.interceptors.response.use((response: AxiosResponse) => {
    return response;
});
