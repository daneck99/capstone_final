import Image from 'next/image';

import { styled } from 'styled-components';
import { Typography } from '@mui/material';

import google from './img/google.png';

interface ButtonProps {
  onClick: () => void;
}

const GoogleBtn = styled.button<ButtonProps>`
  margin-top: 10px;
  width: 350px;
  padding: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  border: 1px solid black;
  cursor: pointer;

  .google {
    width: 25px;
    height: 25px;
    justify-content: left;
  }
`;

const GoogleButton = ({ ...props }: ButtonProps) => {
  return (
    <GoogleBtn {...props}>
      <Image className="google" src={google} alt="google" />
      <Typography ml="10px">구글로 시작하기</Typography>
    </GoogleBtn>
  );
};
export default GoogleButton;
