 

import Cookies, { CookieSetOptions } from 'universal-cookie';

const cookies = new Cookies();

const COMMON_OPTIONS: CookieSetOptions = {
  path: '/',
  expires: new Date(Date.now() + 1000 * 60 * 60), // 1시간 후
  maxAge: 3600, // 1시간 (초)
};

// 쿠키 저장하는 함수
export const setCookie = (
  name: string,
  value: string,
  options: CookieSetOptions
) => {
  return cookies.set(name, value, { ...COMMON_OPTIONS, ...options });
};

// 쿠키 값 가져오는 함수
export const getCookie = (name: string) => {
  return cookies.get(name);
};

// 쿠키 삭제하는 함수
export const removeCookie = (name: string) => {
  return cookies.remove(name);
};
