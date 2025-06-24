 

import React from 'react';

import { Header } from '~/components/atom/header';
import CafeCommentWrite from './CafeCommentWrite';
import {
  CommentContent,
  CommentWrapper,
  FooterContainer,
  Wrapper,
} from './cafeCommentLayout.styled';

interface CafeCommentLayoutProps {
  children: React.ReactNode;
  name: string;
}

const CafeCommentLayout = ({ children, name }: CafeCommentLayoutProps) => {
  return (
    <Wrapper>
      {/* 헤더 */}
      <CommentWrapper>
        <Header name={name} />

        {/* 내용 */}
        <CommentContent>{children}</CommentContent>

        {/* 댓글 달기 */}
        <FooterContainer>
          <CafeCommentWrite />
        </FooterContainer>
      </CommentWrapper>
    </Wrapper>
  );
};
export default CafeCommentLayout;
