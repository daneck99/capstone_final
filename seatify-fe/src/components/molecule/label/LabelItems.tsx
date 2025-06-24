import { Box, Typography } from '@mui/material';

import Clean from '~/static/svg/clean.svg';
import Power from '~/static/svg/power.svg';
import { LabelItem, IconImage } from './label.styled';

interface LabelProps {
  // 플러그 여부
  hasPlug: boolean;
  // 청결 여부
  isClean: boolean;
}

const LabelItems = ({ hasPlug, isClean }: LabelProps) => {
  return (
    <Box>
      {isClean && (
        <LabelItem>
          <IconImage src={Clean} alt="청결" />
          <Typography>청결한 매장</Typography>
        </LabelItem>
      )}
      {hasPlug && (
        <LabelItem>
          <IconImage src={Power} alt="콘센트" />
          <Typography>콘센트 자리가 많은 매장</Typography>
        </LabelItem>
      )}
    </Box>
  );
};

export default LabelItems;
