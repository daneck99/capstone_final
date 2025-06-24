 

const getUserData = async (token: string | undefined, role: string) => {
  try {
    const url = `http://localhost:8080/api/member/info?role=${role}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
};
export default getUserData;
