import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

customAxios.interceptors.request.use(
  (config) => {
    const { accessToken, refreshToken } = parseCookies();

    // ✅ refreshToken 없으면 로그인 페이지로 리디렉션
    if (!refreshToken) {
      Router.push('/login');
      return Promise.reject(
        new axios.Cancel('No refresh token, redirecting to login')
      );
    }

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.config) {
      return Promise.reject(error);
    }

    // 이미 refresh 요청이거나 retry했으면 중단
    if (originalRequest._retry || error.config?.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // accessToken 만료 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return customAxios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          '/api/auth/refresh', // 프록시 주소든 백엔드 주소든 맞게 설정
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        if (!newAccessToken) throw new Error('No access token returned');

        // 쿠키에 저장
        document.cookie = `accessToken=${newAccessToken}; path=/`;

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return await customAxios(originalRequest);
      } catch (refreshError: any) {
        // 👇 이 부분이 핵심: A-005 코드가 오면 재로그인
        if (
          refreshError?.response?.data?.errorCode === 'A-005' ||
          refreshError?.response?.status === 401
        ) {
          processQueue(refreshError, null);
          destroyCookie(null, 'accessToken');
          destroyCookie(null, 'refreshToken');
          Router.push('/login');
        }

        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
