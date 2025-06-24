import Image from 'next/image';

import { Box, styled } from '@mui/material';

// 프로필 사이즈 목록
const SIZE: { [key: string]: number } = {
  sm: 24,
  md: 32,
  lg: 78,
};

const radius: { [key: string]: number } = {
  sm: 20,
  md: 20,
  lg: 35,
};

interface StyleProps {
  size: string;
}

export const Background = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'size',
})(({ size }: StyleProps) => ({
  position: 'relative',
  backgroundColor: '#DADADA',
  width: SIZE[size],
  height: SIZE[size],
  borderRadius: radius[size],
  overflow: 'hidden',
  textAlign: 'center',
}));

export const ProfileImage = styled(Image)(() => ({
  color: 'transparent',
  transform: 'translate(0%, 0%)',
  width: 'inherit',
  height: 'inherit',
  objectFit: 'contain',
}));
