import Image from 'next/image';

import { styled } from 'styled-components';
import { Typography } from '@mui/material';

import kakao from './img/kakao.png';

interface ButtonProps {
  onClick: () => void;
}

const KakaoBtn = styled.button<ButtonProps>`
  margin-top: 100px;
  width: 350px;
  padding: 0.2rem;
  background-color: #ffe400;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;

  .kakao {
    width: 30px;
    height: 30px;
  }
`;

const KakaoButton = ({ ...props }: ButtonProps) => {
  return (
    <KakaoBtn {...props}>
      <Image className="kakao" src={kakao} alt="kakao" />
      <Typography ml="10px">카카오로 시작하기</Typography>
    </KakaoBtn>
  );
};
export default KakaoButton;
