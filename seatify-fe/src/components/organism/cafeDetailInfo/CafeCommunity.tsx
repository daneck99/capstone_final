 

import { useDispatch } from 'react-redux';

import { Typography, useTheme } from '@mui/material';

import { UnderlineButton } from '~/components/atom/buttons';
import { Comment } from '~/types/cafeInfo';
import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { useCallback } from 'react';
import CafeCommunityComment from './CafeCommunityComment';
import {
  CafeCommunityContainer,
  CommentPlusBox,
} from './cafeDetailInfo.styled';

interface CommunityProp {
  comment: Comment[] | [];
}
const CafeCommunity = ({ comment }: CommunityProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigationSelector();
  const theme = useTheme();
  const grayColor = theme.palette.grey[100];

  const content = `${comment.length}개 댓글보기`;

  // 댓글 더 보기 눌렀을 때
  const handleCommentClick = useCallback(() => {
    if (navigate === 'search-detail') {
      dispatch(setNavigationContent('search-comment'));
    } else {
      dispatch(setNavigationContent('comment'));
    }
  }, [navigate, dispatch]);

  return (
    <>
      <CafeCommunityContainer color={grayColor}>
        <Typography variant="h4" mt="20px" mb="15px">
          커뮤니티
        </Typography>
        {comment.length === 0 ? (
          <Typography variant="body2" mb="10px">
            아직 댓글이 없습니다
          </Typography>
        ) : (
          <>
            <CafeCommunityComment content={comment[0].content} />
            {comment.length > 1 && (
              <CafeCommunityComment content={comment[1].content} />
            )}
            {comment.length > 2 && (
              <CafeCommunityComment content={comment[2].content} />
            )}
          </>
        )}
      </CafeCommunityContainer>
      <CommentPlusBox>
        {comment.length !== 0 ? (
          <UnderlineButton text={content} onClick={handleCommentClick} />
        ) : (
          <UnderlineButton
            text="댓글을 입력하세요"
            onClick={handleCommentClick}
          />
        )}
      </CommentPlusBox>
    </>
  );
};
export default CafeCommunity;
