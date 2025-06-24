 

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import HelpIcon from '@mui/icons-material/Help';

import { RadioProps, Status, options } from '~/types/radio';
import { Wrapper } from './radio.styled';

const Radio = ({ status }: RadioProps) => {
  return (
    <Wrapper color={options[status]?.color}>
      {status !== Status.unknown && (
        <RadioButtonCheckedIcon className="mui-icon" />
      )}
      {status === Status.unknown && <HelpIcon className="mui-icon" />}
    </Wrapper>
  );
};
export default Radio;
