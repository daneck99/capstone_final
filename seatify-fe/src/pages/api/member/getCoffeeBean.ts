 

import { customAxios } from '~/utils/customAxios';

const getCoffeeBean = async () => {
  const response = await customAxios.get('/api/member/coffeebean');
  return response.data;
};

export default getCoffeeBean;
