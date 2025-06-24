import styled from 'styled-components';
import { Box, Button, Typography, useTheme } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

interface WriteProp {
  onClick: () => void;
}
interface WriteButtonProps {
  backgroundcolor: string;
}

const StyledWriteButton = styled(Button)<WriteButtonProps>`
  background-color: ${(props) => props.backgroundcolor};
  border-radius: 60px;
  padding: 0px 0px;
  transform: scale(0.75);
`;
const WriteBox = styled(Box)`
  display: flex;
  flex-direction: column;
  color: white;
  svg {
    transform: scale(1.2);
  }
`;

const WriteButton = ({ onClick }: WriteProp) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.primary.main;
  return (
    <StyledWriteButton
      variant="contained"
      color="primary"
      onClick={onClick}
      backgroundcolor={backgroundColor}
    >
      <WriteBox>
        <DriveFileRenameOutlineIcon />
        <Typography variant="caption" color="white">
          글쓰기
        </Typography>
      </WriteBox>
    </StyledWriteButton>
  );
};
export default WriteButton;
