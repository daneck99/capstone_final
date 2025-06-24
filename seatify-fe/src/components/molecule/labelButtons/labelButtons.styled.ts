import { Box, Button, Typography } from '@mui/material';
import { styled } from 'styled-components';

interface SelectButtonProps {
  color1: string;
  selected: boolean;
  onClick: () => void;
}

interface SelectTypographyProps {
  selected: boolean;
  color1: string;
}

export const SelectButton = styled(Button)<SelectButtonProps>`
  && {
    border: ${({ selected, color1 }) =>
      `1.7px solid ${selected ? 'black' : color1}`};
    border-radius: 20px;
    padding: 6px 10px;
    margin: 5px 7px;
  }
`;

export const SelectTypography = styled(Typography)<SelectTypographyProps>`
  color: ${({ color1, selected }) => (selected ? 'black' : color1)};
  margin-left: 5px;
  line-height: 1;
  padding: 0;
`;

export const SelectArrayWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  margin-top: 25px;
`;
