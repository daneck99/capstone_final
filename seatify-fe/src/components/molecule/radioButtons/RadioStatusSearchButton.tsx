 

import { Typography, useTheme } from '@mui/material';
import { CafeSearchBox } from './radioButton.styled';

interface StatusSearchProp {
  onClick?: () => void;
}
const RadioStatusSearchButton = ({ onClick }: StatusSearchProp) => {
  const theme = useTheme();
  const color = theme.palette.primary.main;
  return (
    <CafeSearchBox main={color} onClick={onClick}>
      <Typography color={color} variant="h5">
        실시간 혼잡도 알아보기
      </Typography>
    </CafeSearchBox>
  );
};
export default RadioStatusSearchButton;

RadioStatusSearchButton.defaultProps = {
  onClick: () => {},
};
