import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setCookie } from '~/helpers/cookie';
import { setToken } from '~/store/reducers/authSlice';
import { LoginResponse } from '~/types/auth';
import { getLoginToken } from '../api/user';

function GooglePage() {
  const router = typeof window !== 'undefined' ? useRouter() : null;
  const dispatch = useDispatch();

  useEffect(() => {
    const url = new URL(window.location.href);
    // url에서 access_token 값 변수에 저장
    const token: string = url.hash.substring(
      url.hash.indexOf('=') + 1,
      url.hash.indexOf('&token_type')
    );

    if (token) {
      // 구글 서버로부터 받은 access token으로 jwt 토큰 access token, refresh token 받기
      getLoginToken(token, 'GOOGLE').then((res: LoginResponse) => {
        const accessToken = res.data?.accessToken || '';
        const managedCafeId = res.data?.managedCafeId || '';

        console.log('accessToken from login API:', res.data?.accessToken);
        console.log('managedCafeId from login API:', res.data?.managedCafeId);

        // ✅ managedCafeId까지 Redux에 저장
        dispatch(setToken({ access_token: accessToken, managed_cafe_id: managedCafeId }));

        // refresh 토큰값과 토큰의 만료시간 쿠키에 저장
        const expires = new Date(res.data?.refreshTokenExpireTime || '');
        setCookie('refreshToken', res.data?.refreshToken || '', {
          maxAge: expires.getTime(),
          expires,
        });
        // 로그인이 완료되면 메인으로 라우트
        router.push('/');
      });
    }
  }, [dispatch, router]);
}
export default GooglePage;
