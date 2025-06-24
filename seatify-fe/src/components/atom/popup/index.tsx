 
import { ReactNode } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { ActionButton as PopupActionButton } from '~/types/popup';
import { ActionButton } from './popup.styled';

interface PopupProps {
  // open 여부
  open: boolean;
  // 팝업 header 제목
  title?: string;
  // 팝업 body 부분
  content: string | ReactNode;
  // 팝업 footer 부분
  actions: PopupActionButton[];
  // 팝업 닫기 함수
  onClose: () => void;
}

const Popup = ({ open, title, content, actions, onClose }: PopupProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: { backgroundColor: '#fff', minWidth: 288 },
      }}
    >
      {/* Popup Header */}
      {title !== '' && <DialogTitle variant="h3">{title}</DialogTitle>}

      {/* Popup Body */}
      <DialogContent sx={{ textAlign: 'center' }}>
        {content === 'string' ? (
          <DialogContentText variant="subtitle1">{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>

      {/* Popup Footer */}
      <DialogActions sx={{ flexDirection: 'column' }}>
        {actions.map((v) => (
          <ActionButton key={v.title} actionType={v.type} onClick={v.onClick}>
            {v.title}
          </ActionButton>
        ))}
      </DialogActions>
    </Dialog>
  );
};

Popup.defaultProps = {
  title: '',
};

export default Popup;
