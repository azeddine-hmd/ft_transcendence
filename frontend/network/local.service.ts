import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const localService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// intercept local service requests
localService.interceptors.request.use((config: AxiosRequestConfig) => {
  return config;
});

// intercept local service responses
localService.interceptors.response.use((response: AxiosResponse) => {
  return response;
});
