 
import React, { useCallback, useState } from 'react';

import { Comment } from '~/types/cafeInfo';
import {
  CafeCommentLayout,
  CafeSingleComment,
} from '~/components/molecule/cafeCommentLayout';
import Toast from '~/components/atom/toast';

interface CommentProps {
  name: string;
  comments: Comment[] | [];
  cafeId: string;
}

const CafeDetailComment = ({ name, comments, cafeId }: CommentProps) => {
  const [openToast, setOpenToast] = useState(false);

  // 토스트 닫기 함수
  const closeDeleteToast = useCallback(() => {
    setOpenToast(false);
  }, []);

  // 토스트 열기 함수
  const openDeleteToast = useCallback(() => {
    setOpenToast(true);
  }, []);

  return (
    <CafeCommentLayout name={name}>
      {/* 댓글 삭제 성공 토스트 */}
      <Toast
        open={openToast}
        message="댓글을 성공적으로 삭제했어요."
        color="success"
        location={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={closeDeleteToast}
      />
      {comments &&
        comments?.map((comment: Comment) => (
          <CafeSingleComment
            key={comment.commentId}
            comment={comment}
            cafeId={cafeId}
            openDeleteToast={openDeleteToast}
            type="comment"
          />
        ))}
    </CafeCommentLayout>
  );
};
export default CafeDetailComment;
