import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Keywords } from '~/types/comment';
import { customAxios } from '~/utils/customAxios';

interface CafeComment {
  cafeId: string;
  content: string;
  keywords: Keywords[];
  cafeCongestion: number;  // Added cafeCongestion field
  hasPlug?: boolean;       // Added optional field for hasPlug
  isClean?: boolean;       // Added optional field for isClean
}

const addCafeComment = async (body: CafeComment) => {
  const { cafeId, ...bodyData } = body;

  try {
    console.log('Request Body:', body);  // Output the entire body to check the data

    // Adding the required fields as per the expected request body
    const response = await customAxios.post(
      `http://localhost:8080/api/cafe/${cafeId}/review`,
      {
        ...bodyData, // Spread the existing fields from the bodyData
        cafeCongestion: body.cafeCongestion, // Ensure to add cafeCongestion
        hasPlug: body.hasPlug ?? false,       // Default value for hasPlug if not provided
        isClean: body.isClean ?? false,       // Default value for isClean if not provided
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in API call:', error); // Catch and log the error
    throw error; // Re-throw the error so it's handled in the mutation
  }
};

export default addCafeComment;

// 카페 댓글 작성하는 mutate
export const useAddCafeCommentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addCafeComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cafeList']);
      queryClient.invalidateQueries(['comment']);
    },
    onError: (error) => {
      console.error('Mutation error:', error); // Log the mutation error
    },
  });
};
