// 📁 pages/api/member/getMemberMyPage.ts
import { MyPageResponse } from '~/types/mypage';

const getMemberMyPage = async (token: string): Promise<MyPageResponse> => {
  const res = await fetch(`http://localhost:8080/api/member/mypage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`HTTP ${res.status}: ${error}`);
  }

  return await res.json(); // ✅ JSON 파싱
};

export default getMemberMyPage;
