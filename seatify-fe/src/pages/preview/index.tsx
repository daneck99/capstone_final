 
import { Box } from '@mui/material';

import ButtonPreview from '~/components/pages/preview/ButtonPreview';
import ModalPreview from '~/components/pages/preview/ModalPreview';
import PopupPreview from '~/components/pages/preview/PopupPreview';
import RadioButtonPreview from '~/components/pages/preview/RadioButtonPreview';
import ToastPreview from '~/components/pages/preview/ToastPreview';

const Comp = () => {
  return (
    <Box>
      <h1>cafe in</h1>
      <h4>Button Component</h4>
      <ButtonPreview />
      <h4>Popup Component</h4>
      <PopupPreview />
      <h4>Modal Component</h4>
      <ModalPreview />
      <h4>Toast Message Component</h4>
      <ToastPreview />
      <h4>Radio Button Component</h4>
      <RadioButtonPreview />
    </Box>
  );
};

export default Comp;
