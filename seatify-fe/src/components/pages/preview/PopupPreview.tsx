 
import { useCallback, useMemo, useState } from 'react';

import { Box, Typography } from '@mui/material';

import Popup from '~/components/atom/popup';
import { BoxButton } from '~/components/atom/buttons';
import { ActionButton } from '~/types/popup';

const PopupPreview = () => {
  const [open, setOpen] = useState(false);

  // 팝업 열기 함수
  const openPopup = () => {
    setOpen(true);
  };

  // 팝업 닫기 함수
  const closePopup = useCallback(() => {
    setOpen(false);
  }, []);

  // 팝업 확인 함수
  const onConfirm = useCallback(() => {
    closePopup();
  }, [closePopup]);

  // 팝업 Button 목록
  const actions: ActionButton[] = useMemo(() => {
    return [
      {
        title: '확인',
        type: 'confirm',
        onClick: onConfirm,
      },
      { title: '취소', type: 'close', onClick: closePopup },
    ];
  }, [closePopup, onConfirm]);

  return (
    <Box>
      <BoxButton title="Open Popup" onClick={openPopup} />

      <Popup
        open={open}
        title="제목입니다."
        content={<Typography variant="subtitle2">내용입니다.</Typography>}
        actions={actions}
        onClose={closePopup}
      />
    </Box>
  );
};

export default PopupPreview;
