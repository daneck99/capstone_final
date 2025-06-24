import React from 'react';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { Typography } from '@mui/material';
import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { useDispatch } from 'react-redux';
import { HeaderContainer } from './header.styled';

interface HeaderWrapperProps {
  name: string;
  children: React.ReactNode;
}

const HeaderWrapper = ({ name, children }: HeaderWrapperProps) => {
  const navigate = useNavigationSelector();

  const dispatch = useDispatch();
  // 뒤로 가기 버튼
  const handleBackArrowClick = () => {
    if (navigate === 'comment') {
      dispatch(setNavigationContent('content'));
    }
    if (navigate === 're-comment' || navigate === 'write') {
      dispatch(setNavigationContent('comment'));
    }
    if (navigate === 'search-comment') {
      dispatch(setNavigationContent('search-detail'));
    }
    if (navigate === 'search-re-comment') {
      dispatch(setNavigationContent('search-comment'));
    }
    if (navigate === 'search-write') {
      dispatch(setNavigationContent('search-comment'));
    }
  };
  return (
    <HeaderContainer>
      <ArrowBackIosNewIcon
        className="mui-icon"
        onClick={handleBackArrowClick}
      />

      <Typography variant="h4" className="title" mr="20px">
        {name}
      </Typography>
      {children}
    </HeaderContainer>
  );
};
export default HeaderWrapper;
