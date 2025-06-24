 

import {
  CafeCommentLayout,
  // CafeSingleComment,
} from '~/components/molecule/cafeCommentLayout';

const CafeReComment = () => {
  // 더미 댓글 데이터
  // const data = {
  //  commentId: '1',
  //  memberName: 'member',
  //  createdTime: '10분전',
  //  content: '커피 있나요',
  //  keywords: [],
  // };
  return (
    <CafeCommentLayout name="cafe">
      {/* <CafeSingleComment comment={data} type="top-comment" cafeId="1" />
      <CafeSingleComment comment={data} type="re-comment" cafeId="1" /> */}
    </CafeCommentLayout>
  );
};
export default CafeReComment;
