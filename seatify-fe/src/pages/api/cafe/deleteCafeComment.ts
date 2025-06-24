 

import { customAxios } from '~/utils/customAxios';

interface CafeComment {
  cafeId: string;
  commentId: string;
}

const deleteCafeComment = async (body: CafeComment) => {
  const { cafeId, commentId } = body;

  const response = await customAxios.delete(
    `/api/cafe/${cafeId}/comment/${commentId}`
  );
  return response.data;
};
export default deleteCafeComment;
