import { Box } from '@mui/material';
import { styled } from '@mui/styles';
import Image from 'next/image';

export const LabelItem = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '10px 0',
}));

export const IconImage = styled(Image)(() => ({
  margin: '0 4px 0 0',
}));

export const CommentLabelItem = styled(Box)(() => ({
  borderRadius: '50px',
  backgroundColor: '#FFF4E9',
  padding: '1px 5px',
}));
