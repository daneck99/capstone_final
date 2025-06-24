

const getAccessToken = async (token: string) => {
  try {
    const url = 'http://localhost:8080/api/access-token/issue';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const data = await response.json();
    // for debug
    console.log('[refresh 응답ㅋㅋ]', data);
    return data;
  } catch (error) {
    return error;
  }
};
export default getAccessToken;
