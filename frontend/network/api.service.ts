import axios, { AxiosResponse } from "axios";

export const apiService = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// intercept requests
apiService.interceptors.request.use((config) => {
  if (typeof config !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
  }
  return config;
});

// intercept responses
apiService.interceptors.response.use((response: AxiosResponse) => {
  return response;
});
