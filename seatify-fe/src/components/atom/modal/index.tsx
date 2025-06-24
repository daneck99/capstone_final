import { ReactNode } from 'react';
import { Modal as MuiModal } from '@mui/material';
import { ModalContainer } from './modal.styled';

interface ModalProps {
  open: boolean;
  children: ReactNode;
  onClose: () => void;
  height?: string;
  width?: string;
  isBorder?: string;
}

const Modal = ({
  open,
  children,
  onClose,
  height,
  width,
  isBorder,
}: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose} disableEnforceFocus>
      <ModalContainer
        id="modal-root"
        style={{ height, width, borderRadius: isBorder }}
      >
        {children}
      </ModalContainer>
    </MuiModal>
  );
};

export default Modal;

Modal.defaultProps = {
  height: 'auto',
  width: 'auto',
  isBorder: 'auto',
};
