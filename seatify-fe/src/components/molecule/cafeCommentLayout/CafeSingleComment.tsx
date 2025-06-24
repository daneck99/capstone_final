 
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import { Typography, useTheme } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { Comment } from '~/types/cafeInfo';
import { EngKeywords } from '~/types/comment';
import Profile from '~/components/atom/profile';

import chat from '../../../static/images/chat.png';
import heart from '../../../static/images/heart.png';
import {
  CommentContainer,
  CommentFlexWrapper,
  CommentLabelWrapper,
  SingleCommentContent,
  SingleCommentTitle,
} from './cafeCommentLayout.styled';
import { CommentLabelItems } from '../label';
import CommentDeleteModal from './CommentDeleteModal';

interface CommentProps {
  comment: Comment;
  cafeId: string;
  type: 'comment' | 're-comment' | 'top-comment';
  openDeleteToast: () => void;
}

const CafeSingleComment = ({
  comment,
  cafeId,
  type,
  openDeleteToast,
}: CommentProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigationSelector();

  const [deleteModal, setDeleteModal] = useState(false);

  const theme = useTheme();
  const nameColor = theme.palette.grey[500];
  const timeColor = theme.palette.grey[300];
  const iconColor = theme.palette.grey[400];
  const borderColor = theme.palette.grey[100];
  const backgroundColor = theme.palette.grey[50];

  // 댓글 클릭했을 때 대댓글로 이동
  const handleCommentClick = () => {
    if (navigate === 'comment') {
      dispatch(setNavigationContent('re-comment'));
    }
    if (navigate === 'search-comment') {
      dispatch(setNavigationContent('search-re-comment'));
    }
  };

  // 삭제 Modal 열기 함수
  const openDeleteModal = () => {
    setDeleteModal(true);
  };

  // 삭제 Modal 닫기 함수
  const closeDeleteModal = useCallback(() => {
    setDeleteModal(false);
  }, []);

  // 댓글 설정 눌렀을 때
  const handleCommentSetting = () => {
    openDeleteModal();
  };

  return (
    <>
      {/* 댓글 삭제 모달 */}
      <CommentDeleteModal
        commentId={comment.commentId}
        cafeId={cafeId}
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        setDeleteToast={openDeleteToast}
      />

      <CommentContainer
        color1={iconColor}
        color2={borderColor}
        color3={backgroundColor}
        type={type}
      >
        <Profile size="md" />
        <SingleCommentContent>
          <SingleCommentTitle type={type}>
            <CommentFlexWrapper>
              <Typography color={nameColor} variant="body1" mr="5px">
                {comment.memberName}
              </Typography>
              <CommentLabelWrapper>
                {comment.keywords &&
                  comment.keywords.map((keyword: EngKeywords) => (
                    <CommentLabelItems key={keyword} type={keyword} />
                  ))}
              </CommentLabelWrapper>
            </CommentFlexWrapper>

            <Typography color={timeColor} variant="body2">
              {comment.createdTime}
            </Typography>
          </SingleCommentTitle>
          <Typography mb="5px" mt="5px">
            {comment.content}
          </Typography>
          <CommentFlexWrapper>
            {type !== 're-comment' && (
              <>
                <Image
                  src={heart}
                  height={15}
                  style={{ cursor: 'pointer' }}
                  alt=""
                />
                <Typography ml="5px" mr="15px">
                  9
                </Typography>
              </>
            )}

            {type === 'comment' && (
              <>
                <Image
                  src={chat}
                  width={20}
                  height={20}
                  style={{ cursor: 'pointer' }}
                  onClick={handleCommentClick}
                  alt=""
                />
                <Typography ml="5px">2</Typography>
              </>
            )}
          </CommentFlexWrapper>
        </SingleCommentContent>
        <MoreVertIcon className="menu-icon" onClick={handleCommentSetting} />
      </CommentContainer>
    </>
  );
};
export default CafeSingleComment;
