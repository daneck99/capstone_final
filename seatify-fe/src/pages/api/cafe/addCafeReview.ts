 

import { customAxios } from '~/utils/customAxios';

interface CafeReview {
  cafeId: string;
  cafeCongestion: string;
  hasPlug: string;
  isClean: string;
}
const addCafeReview = async (body: CafeReview) => {
  const { cafeId, ...bodyData } = body;
  const response = await customAxios.post(
    `/api/cafe/${cafeId}/review`,
    bodyData
  );
  return response.data;
};
export default addCafeReview;
