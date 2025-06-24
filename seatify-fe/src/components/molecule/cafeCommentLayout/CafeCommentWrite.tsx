 

import { useDispatch } from 'react-redux';

import { useTheme } from '@mui/material';

import Profile from '~/components/atom/profile';
import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { WriteContainer } from './cafeCommentLayout.styled';

const CafeCommentWrite = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const borderColor = theme.palette.grey[200];
  const inputColor = theme.palette.grey[100];
  const navigate = useNavigationSelector();

  // 댓글 작성 페이지로 이동
  const handleWriteCommentClick = () => {
    if (navigate === 'comment') {
      dispatch(setNavigationContent('write'));
    }
    if (navigate === 'search-comment') {
      dispatch(setNavigationContent('search-write'));
    }
  };
  return (
    <WriteContainer color1={borderColor} color2={inputColor}>
      <Profile size="md" />
      <input
        type="text"
        placeholder="댓글을 입력하세요"
        onClick={handleWriteCommentClick}
      />
    </WriteContainer>
  );
};
export default CafeCommentWrite;
