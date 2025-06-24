 

import { Typography, useTheme } from '@mui/material';
import { EngKeywords, keywordOptions } from '~/types/comment';
import { CommentLabelItem } from './label.styled';

interface CommentLabelProp {
  type: EngKeywords;
}
const CommentLabelItems = ({ type }: CommentLabelProp) => {
  const theme = useTheme();
  const mainColor = theme.palette.primary.main;
  return (
    <CommentLabelItem>
      <Typography variant="subtitle2" color={mainColor}>
        {keywordOptions[type].title}
      </Typography>
    </CommentLabelItem>
  );
};
export default CommentLabelItems;
