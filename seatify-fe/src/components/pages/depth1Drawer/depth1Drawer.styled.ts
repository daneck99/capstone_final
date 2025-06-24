 

import { Box, Button, styled } from '@mui/material';

export const Depth1Box = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  left: `calc(${theme.spacing(8)} + 1px)`,
  height: '100%',
  zIndex: 1,
}));

export const SwipeButton = styled(Button)(() => ({
  height: 60,
  right: 0,
  backgroundColor: '#fff',
  minWidth: 'auto',
  padding: 0,
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
  alignSelf: 'center',
  '&:hover': {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },
}));

export const CloseButton = styled(Button)(() => ({
  position: 'absolute',
  top: 50,
  right: -20,
  height: 'fit-content',
  backgroundColor: '#fff',
  minWidth: 'auto',
  padding: 10,
  borderStartStartRadius: 0,
  borderEndStartRadius: 0,
  '&:hover': {
    backgroundColor: '#ffffff',
    boxShadow: 'none',
  },
}));
