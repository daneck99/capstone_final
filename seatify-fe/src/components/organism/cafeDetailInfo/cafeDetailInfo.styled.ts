import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

// index.tsx 파일 styled component
export interface CafeInfoProps {
  color: string;
}
export const CafeDetailContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const CafeContentContainer = styled(Box)<CafeInfoProps>`
  border-bottom: 4px solid ${(props) => props.color};
`;

export const CafeStatusTypography = styled(Typography)<CafeInfoProps>`
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  color: black;
`;

export const CafeTitle = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

export const CafeTitleContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-top: 5px;
  .mui-icon {
    color: black;
    margin-right: 10px;
  }
`;
// CafePlaceInfo 컴포넌트 styled component
interface CafeColorProps {
  color: string;
  icon: string;
}

// CafePlaceInfo 컴포넌트 styled component
export const CafePlaceContainer = styled(Box)<CafeColorProps>`
  width: 100%;
  border-bottom: 4px solid ${(props) => props.color};
  display: flex;
  flex-direction: column;
  float: left;
  .cafe-info {
    display: flex;
    align-items: center;
    margin-top: 18px;
    svg {
      color: ${(props) => props.icon};
      transform: scale(0.8);
      margin-right: 5px;
    }
  }
`;
export const CongestionBox = styled(Box)`
  padding: 1.2rem;
`;
export const CongestionItem = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// CafeCommunity 컴포넌트 styled component
export const CafeCommunityContainer = styled(Box)<CafeInfoProps>`
  border-bottom: 1px solid ${(prop) => prop.color};
`;

// CafeCommunityComment 컴포넌트 styled component
export const CommentBox = styled(Box)<CafeInfoProps>`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  .arrow {
    padding: 0.6rem;
    border-radius: 6px;
    background-color: ${(props) => props.color};
    width: 100%;
  }
`;

export const CommentPlusBox = styled(Box)`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

// CafeReviewModal 컴포넌트 styled component
export const ReviewTitle = styled(Box)<CafeInfoProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.color};
`;
export const ReviewContent = styled(Box)<CafeInfoProps>`
  display: flex;
  border-bottom: 1px solid ${(props) => props.color};
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

// CafeCongestionPopup 컴포넌트 styled component
export const CongestionCoffee = styled(Box)`
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  border: 1px solid black;
  padding: 3px;
`;
