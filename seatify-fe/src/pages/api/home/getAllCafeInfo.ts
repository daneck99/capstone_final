 

import { customAxios } from '~/utils/customAxios';

const getAllCafeInfo = async (token: string) => {
  const response = await customAxios.get('/api/home', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default getAllCafeInfo;
