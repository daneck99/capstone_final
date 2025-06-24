import { Box, styled } from '@mui/material';

export const DRAWER_BLEEDING = 205;

export const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.grey[800],
  position: 'absolute',
  top: -DRAWER_BLEEDING,
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  right: 0,
  left: 0,
  boxShadow: '0px 2px 9px 5px gray',
  visibility: 'visible',
  height: `calc(100% + ${DRAWER_BLEEDING}px)`,
}));

export const Puller = styled(Box)(() => ({
  width: 40,
  height: 3,
  backgroundColor: '#E4E4E4',
  borderRadius: 3,
  position: 'absolute',
  top: 20,
  left: 'calc(50% - 15px)',
}));

export const ContentBox = styled(Box)`
  margin-top: 50px;
  height: 90%;
  overflow: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface ColorProp {
  color1: string;
}

export const ButtonContainer = styled(Box)<ColorProp>`
  background-color: ${(props) => props.color1};
  width: 44px;
  height: 44px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 15px;
  cursor: pointer;
`;

export const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
`;
