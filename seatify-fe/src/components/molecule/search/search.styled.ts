import { Box, styled } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export const StyledWrapper = styled(Box)(() => ({
  width: '90%',
  position: 'relative',
  marginLeft: '20px',
  marginTop: '15px',
  '@media (max-width: 660px)': {
    position: 'inherit',
    marginLeft: '10px',
  },
}));

export const StyledArrowIcon = styled(ArrowBackIosNewIcon)(() => ({
  margin: '10px 15px 10px 15px',
}));

export const StyledInput = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 660px)': {
    marginBottom: '29px',
  },
}));

export const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#F8F8F8',
  width: '100%',
  borderRadius: '4px',
}));

export const StyledSearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  backgroundColor: '#F8F8F8',
  zIndex: 1,
  position: 'absolute',
  width: '100%',
  top: 'calc(100%)',
  padding: '0px 15px 10px 15px',
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  cursor: 'pointer',

  '@media (max-width: 600px)': {
    width: '100%',
    backgroundColor: 'white',
    marginLeft: '0px',
    borderTop: 'none',
    position: 'inherit',
  },
}));
