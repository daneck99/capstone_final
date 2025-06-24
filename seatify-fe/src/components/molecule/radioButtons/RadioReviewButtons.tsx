 
import Image from 'next/image';

import { Box, Typography, useTheme } from '@mui/material';

import { reviewOptions } from '~/types/review';
import radioSelect from '../../../static/images/radio-select.png';
import radioNotSelect from '../../../static/images/radio-not-select.png';
import { ReviewRadio, ReviewRadioContent } from './radioButton.styled';

interface ReviewButtonProps {
  type: 'cafeCongestion' | 'hasPlug' | 'isClean';
  state: string;
  setState: (data: string) => void;
}

const RadioReviewButtons = ({ type, state, setState }: ReviewButtonProps) => {
  const theme = useTheme();
  const grayColor = theme.palette.grey[300];
  const selectColor = theme.palette.primary.main;

  return (
    <Box>
      <Typography mt="10px" mb="10px">
        {reviewOptions[type].title}
      </Typography>
      <ReviewRadio>
        {reviewOptions[type].select.map((value, index) => (
          <ReviewRadioContent key={value}>
            {/* 선택되었을 경우 */}
            {state === reviewOptions[type].selectValue[index] ? (
              <>
                <Image src={radioSelect} alt="" style={{ cursor: 'pointer' }} />
                <Typography color={selectColor}>{value}</Typography>
              </>
            ) : (
              // 선택되지 않았을 경우
              <>
                <Image
                  src={radioNotSelect}
                  alt=""
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setState(reviewOptions[type].selectValue[index])
                  }
                />
                <Typography color={grayColor}>{value}</Typography>
              </>
            )}
          </ReviewRadioContent>
        ))}
      </ReviewRadio>
    </Box>
  );
};
export default RadioReviewButtons;
