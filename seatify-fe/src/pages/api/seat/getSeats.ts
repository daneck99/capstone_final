// 좌석 정보를 가져오는 함수 (API 호출)
export const fetchSeats = async (cafeId: string, token: string) => {
  try {
    const res = await fetch(`http://localhost:8080/api/cafe/${cafeId}/seats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,  // Bearer 토큰 추가
      },
    });

    if (!res.ok) {
      // 서버 응답이 실패하면 에러 발생
      throw new Error(`좌석 정보를 불러오는 데 실패했습니다. 상태 코드: ${res.status}`);
    }

    const data = await res.json();
    return data;  // 좌석 정보 반환
  } catch (error) {
    // 요청이나 응답 처리 중 오류 발생 시 에러 출력
    console.error('Error fetching seats:', error);
    throw new Error('좌석 정보를 불러오는 데 오류가 발생했습니다.');
  }
};
