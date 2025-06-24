import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Typography } from '@mui/material';

import Modal from '~/components/atom/modal';
import deleteCafeComment from '~/pages/api/cafe/deleteCafeComment';
import { DeleteContainer, StyledBoxButton } from './cafeCommentLayout.styled';

interface DeleteModalProps {
  commentId: string;
  cafeId: string;
  deleteModal: boolean;
  closeDeleteModal: () => void;
  setDeleteToast: () => void;
}

const CommentDeleteModal = ({
  commentId,
  cafeId,
  deleteModal,
  closeDeleteModal,
  setDeleteToast,
}: DeleteModalProps) => {

  // 댓글 삭제하는 react query 문
  const queryClient = useQueryClient();
  const { mutate: deleteMutate } = useMutation(deleteCafeComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['comment']);
      setDeleteToast();
    },
  });

  // 삭제 모달 확인 버튼 눌렀을 때
  const deleteCommentHandler = () => {
    closeDeleteModal();

    deleteMutate({
      commentId,
      cafeId,
    });
  };

  return (
    <Modal
      open={deleteModal}
      onClose={closeDeleteModal}
      isBorder="8px"
      width='300px'
    >
      <DeleteContainer>
        <Typography variant="h4" mt="80x" mb="10px">
          댓글을 삭제하시겠습니까?
        </Typography>
        <StyledBoxButton
          title="네"
          color="warning"
          padding="sm"
          onClick={deleteCommentHandler}
        />
        <StyledBoxButton
          title="아니오"
          color="secondary"
          padding="sm"
          onClick={closeDeleteModal}
        />
      </DeleteContainer>
    </Modal>
  );
};
export default CommentDeleteModal;
