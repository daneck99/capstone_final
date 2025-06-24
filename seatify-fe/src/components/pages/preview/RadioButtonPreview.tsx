import { Box } from '@mui/material';

import RadioStatusButton from '~/components/molecule/radioButtons/RadioStatusButton';

const RadioButtonPreview = () => {
  return (
    <Box>
      <RadioStatusButton status="1" />
      <RadioStatusButton status="2" />
      <RadioStatusButton status="3" />
      <RadioStatusButton status="0" />
    </Box>
  );
};
export default RadioButtonPreview;
