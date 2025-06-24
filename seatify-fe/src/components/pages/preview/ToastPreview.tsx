 
import { useCallback, useState } from 'react';

import { Box } from '@mui/material';

import { BoxButton } from '~/components/atom/buttons';
import Toast from '~/components/atom/toast';

const ToastPreview = () => {
  const [open, setOpen] = useState(false);

  // 팝업 열기 함수
  const openPopup = () => {
    setOpen(true);
  };

  // 팝업 닫기 함수
  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Box>
      <BoxButton title="Open Popup" onClick={openPopup} />

      <Toast
        open={open}
        message="오류 메시지입니다!"
        color="error"
        onClose={closePopup}
      />
    </Box>
  );
};

export default ToastPreview;
