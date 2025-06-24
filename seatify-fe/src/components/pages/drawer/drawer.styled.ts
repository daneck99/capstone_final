 

import {
  Drawer as MuiDrawer,
  styled,
  Theme,
  CSSObject,
  DrawerProps,
  Button,
} from '@mui/material';

export const drawerWidth = 390;

export const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

export const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 0,
});

interface MuiDrawerProps extends DrawerProps {
  theme?: Theme;
  isSecondProps?: boolean;
}

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isSecondProps',
})(({ theme, open, isSecondProps = false }: MuiDrawerProps) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiPaper-root': {
    left: isSecondProps ? 'auto' : 0,
    backgroundColor: '#fff',
    borderRight: '0.1px solid rgba(0, 0, 0, 0.12)',
    width: 'inherit',
  },
  ...(!isSecondProps &&
    theme && {
      [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
      },
    }),
  ...(isSecondProps &&
    theme &&
    open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
  ...(isSecondProps &&
    theme &&
    !open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
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
