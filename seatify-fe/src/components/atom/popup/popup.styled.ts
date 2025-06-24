import { Button, styled } from '@mui/material';

import { ExtendedStyleProps } from '~/types/theme';

interface StyleProps extends ExtendedStyleProps {
  actionType: string;
}

// Popup Action Button Styled Component
export const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'type',
})(({ theme, actionType }: StyleProps) => ({
  width: '100%',
  color: actionType === 'confirm' ? '#fff' : theme?.palette.grey[500],
  backgroundColor:
    actionType === 'confirm' ? theme?.palette.primary.main : '#fff',
  '&:hover': {
    backgroundColor:
      actionType === 'confirm'
        ? theme?.palette.primary.main
        : theme?.palette.grey[200],
    opacity: 0.8,
  },
  '&:not(:first-of-type)': {
    marginTop: 1,
    marginLeft: 0,
  },
}));
