import Image from 'next/image';

import { Box, styled } from '@mui/material';

export const ProfileContainer = styled(Box)(() => ({
  width: '100%',
  margin: '50px auto',
  flexDirection: 'column',
  textAlign: 'center',
}));

export const BadgeImg = styled(Image)(() => ({
  position: 'absolute',
  width: 22,
  height: 22,
  left: '55%',
  marginTop: 3,
  zIndex: 1,
}));
