import { Box, SwipeableDrawer, styled } from '@mui/material';

export const ModalContainer = styled(Box)(() => ({
  backgroundColor: '#fff',
  minWidth: 100,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  padding: 4,
}));

export const BottomDrawer = styled(SwipeableDrawer)(() => ({
  '& .MuiPaper-root': {
    height: `50%`,
    overflow: 'visible',
  },
}));

export const BottomModalContainer = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[800],
  position: 'absolute',
  top: 0,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  right: 0,
  left: 0,
  boxShadow: '0px 2px 9px 5px gray',
  height: `calc(100% + 10px)`,
}));
