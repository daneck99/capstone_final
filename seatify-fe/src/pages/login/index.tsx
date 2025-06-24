 

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Typography } from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import styled from 'styled-components';
import SnsButton from '~/components/molecule/buttons/SnsButton';
import { setCookie } from '~/helpers/cookie';
import image from '~/static/images/cafe-in-logo.png';
import { setToken } from '~/store/reducers/authSlice';
import { KakaoResponse, LoginResponse } from '~/types/auth';
import { getLoginToken } from '../api/user';

const MyArrowBackIosNewIcon = styled(ArrowBackIosNewIcon)`
  margin-left: 20%;
  margin-top: 15px;
  cursor: pointer;
  @media (max-width: 768px) {
    margin: 5px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 150px;
`;

const LoginPage = () => {
  const router = ();
  const dispatch = useDispatch();

  // 카카오 로그인 클릭했을 때
  const kakaoLoginHandler = useCallback(async () => {
    window.Kakao.Auth.login({
      success: async (kakao_data: KakaoResponse) => {
        // 카카오톡 서버로 부터 access token 받기
        const token: string = kakao_data.access_token;

        // api 통신으로 jwt 토큰 access token, refresh token 받기
        const res: LoginResponse = await getLoginToken(token, 'KAKAO');
        // jwt access token 리덕스에 저장
        const accessToken = res.data?.accessToken || '';
        console.log('accessToken from login response:', accessToken);

        dispatch(setToken({ access_token: accessToken }));

        // refresh 토큰값과 토큰의 만료시간 쿠키에 저장
        const expires = new Date(res.data?.refreshTokenExpireTime || '');
        setCookie('refreshToken', res.data?.refreshToken || '', {
          maxAge: expires.getTime(),
          expires,
        });

        // 로그인이 완료되면 메인으로 라우트
        router.push('/');
      },
    });
  }, [dispatch, router]);

  // 구글 로그인 클릭했을 때
  // 구글 로그인하기 위한 url로 이동
  const googleLoginHandler = useCallback(() => {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?' +
      `client_id=${process.env.NEXT_PUBLIC_GOOGLE_KEY}&` +
      `redirect_uri=http://localhost:3000/google&` +
      'response_type=token&' +
      'scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile';
  }, []);

  const backClickHandler = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div>
      <MyArrowBackIosNewIcon onClick={backClickHandler} />
      <Wrapper>
        <Typography mb="20px">
          주변 카페, 내 자리가 있을까 궁금할 때?
        </Typography>
        <Image src={image} alt="logo" />
        <SnsButton type="kakao" onClick={kakaoLoginHandler} />
        <SnsButton type="google" onClick={googleLoginHandler} />
      </Wrapper>
    </div>
  );
};
export default LoginPage;
