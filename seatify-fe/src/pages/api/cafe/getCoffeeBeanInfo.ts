 

import { CafeComment } from '~/types/cafeInfo';
import { customAxios } from '~/utils/customAxios';

const getCoffeeBeanInfo = async (cafeId: string, token: string) => {
  const response = await customAxios.get(`/api/cafe/${cafeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data as CafeComment;
};

export default getCoffeeBeanInfo;
