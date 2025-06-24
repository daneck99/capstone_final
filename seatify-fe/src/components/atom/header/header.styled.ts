import { Box } from '@mui/material';
import { styled } from 'styled-components';

export const HeaderContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  height: 35px;
  .mui-icon {
    margin-left: 20px;
    cursor: pointer;
  }
  .mui-home-icon {
    cursor: pointer;
    transform: scale(1.5);
    margin-left: 10px;
  }
  .title {
    flex: 1;
    text-align: center;
  }
`;

export const HeaderButtonContainer = styled(Box)`
  .mui-icon {
    margin-left: 20px;
    cursor: pointer;
  }
  .title {
    flex: 1;
    text-align: center;
  }
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
