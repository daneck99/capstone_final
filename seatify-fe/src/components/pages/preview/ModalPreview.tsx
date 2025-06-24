 
import { useCallback, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { BoxButton } from '~/components/atom/buttons';
import Modal from '~/components/atom/modal';

const ModalPreview = () => {
  const [open, setOpen] = useState(false);

  // Modal 열기 함수
  const openPopup = () => {
    setOpen(true);
  };

  // Modal 닫기 함수
  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box>
      <BoxButton title="Open Modal" onClick={openPopup} />

      <Modal open={open} onClose={closePopup}>
        <Typography>Content 영역입니다.</Typography>
      </Modal>
    </Box>
  );
};

export default ModalPreview;
