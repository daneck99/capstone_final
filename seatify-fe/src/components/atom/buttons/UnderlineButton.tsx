 

import { Button, Typography } from '@mui/material';
import styled from 'styled-components';

const CustomButton = styled(Button)`
  background-color: white;
  color: black;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    background-color: white;
  }
`;

interface UnderlineProp {
  text: string;
  onClick?: () => void;
}

const UnderlineButton = ({ text, onClick }: UnderlineProp) => {
  return (
    <CustomButton onClick={onClick}>
      <Typography variant="caption">{text}</Typography>
    </CustomButton>
  );
};

UnderlineButton.defaultProps = {
  onClick: () => {},
};
export default UnderlineButton;
