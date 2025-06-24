import { TextField } from '@mui/material';
import styled from 'styled-components';

export const StyledTextField = styled(TextField)`
  display: flex;
  justify-content: center;
  margin: 15px 10px;

  & .MuiOutlinedInput-root {
    border: none;
    &:hover .MuiOutlinedInput-notchedOutline {
      border: none;
    }
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;
