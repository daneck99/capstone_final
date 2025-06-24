import axios from 'axios';
import { LoginResponse } from '~/types/auth';

const getLoginToken = async (token: string, type: string) => {
  try {
    console.log('📢 axios에 붙는 토큰:', token);

    const res: LoginResponse = await axios.post(
      'http://localhost:8080/api/oauth/login',
      {
        memberType: `${type}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // ✅ 전체 응답 콘솔 출력
    console.log('✅ 로그인 응답 전체:', res);
    console.log('✅ accessToken:', res.data?.accessToken);
    console.log('✅ refreshToken:', res.data?.refreshToken);
    console.log('✅ managedCafeId:', res.data?.managedCafeId);  // ✅ 추가 확인

    return { data: res.data, success: true };  // ✅ 이렇게 리턴
  } catch (error) {
    console.error('❌ 로그인 에러:', error);
    return { success: false };
  }
};

export default getLoginToken;
