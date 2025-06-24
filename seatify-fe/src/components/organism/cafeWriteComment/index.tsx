 

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@mui/material';

import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { Keywords } from '~/types/comment';
import LabelButtons from '~/components/molecule/labelButtons/LabelButtons';

import { useAddCafeCommentMutation } from '~/pages/api/cafe/addCafeComment';
import { HeaderWrapper } from '~/components/atom/header';
import { StyledTextField } from './cafeWriteComment.styled';

interface WriteProp {
  name: string;
  cafeId: string;
}

const CafeWriteComment = ({ name, cafeId }: WriteProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigationSelector();

  // 선택한 keywords 옵션들
  const [options, setOptions] = useState<Keywords[]>([]);
  // 댓글 content
  const [textValue, setTextValue] = useState('');

  const placeholderValue =
    '선택하고 싶은 키워드가 있다면 선택해주세요.\n\n주제와 관련된 이야기를 포함해주세요.\n욕설이나 비방을 포함한 의견을 남기지 말아주세요.';

  // 댓글 작성 react query문
  const { mutate: writeCommentMutate } = useAddCafeCommentMutation();

  // 댓글 키워드 set하는 함수
  const setOptionsHandler = useCallback(
    (data: Keywords[]) => {
      setOptions(data);
    },
    [setOptions]
  );

  // placeholder 입력 시 안보이게 처리
  const handleFocus = () => {
    if (textValue === placeholderValue) {
      setTextValue('');
    }
  };

  // 댓글 등록 처리
  const writeCommentClickHandler = () => {
    const body = { cafeId, content: textValue, keywords: options };
    writeCommentMutate(body);
    // 작성하고 댓글 리스트로 이동
    if (navigate === 'write') {
      dispatch(setNavigationContent('comment'));
    }
    if (navigate === 'search-write') {
      dispatch(setNavigationContent('search-comment'));
    }
  };

  return (
    <>
      <HeaderWrapper name={name}>
        <Button disabled={textValue === ''} onClick={writeCommentClickHandler}>
          등록
        </Button>
      </HeaderWrapper>

      <LabelButtons options={options} setOptions={setOptionsHandler} />

      <StyledTextField
        multiline
        rows={20}
        placeholder={placeholderValue}
        value={textValue}
        onFocus={handleFocus}
        onChange={(e) => setTextValue(e.target.value)}
      />
    </>
  );
};
export default CafeWriteComment;
