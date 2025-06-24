 

import { Typography } from '@mui/material';

import Radio from '~/components/atom/radio';
import { RadioStatusProps, options } from '~/types/radio';
import { CafeStatusSearch } from './radioButton.styled';

const RadioStatusBoxButton = ({ status, onClick }: RadioStatusProps) => {
  const isBorder = status === '0';
  return (
    <CafeStatusSearch
      bordercolor={options[status]?.color}
      background={options[status]?.color2}
      isborder={isBorder.toString()}
      onClick={onClick}
    >
      <Radio status={status} />
      <Typography variant="subtitle2" color={options[status]?.color}>
        {options[status]?.label2}
      </Typography>
    </CafeStatusSearch>
  );
};
export default RadioStatusBoxButton;
