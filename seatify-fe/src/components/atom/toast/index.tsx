 
import { Alert, AlertColor, Snackbar } from '@mui/material';

interface ToastProps {
  // open 여부
  open: boolean;
  // toast message
  message: string;
  // toast message 색상
  color: AlertColor;
  // 팝업 닫기 함수
  onClose: () => void;
  // 표시 위치
  location?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

const Toast = ({ open, message, color, onClose, location }: ToastProps) => {
  return (
    <Snackbar
      open={open}
      // 표시되는 시간
      autoHideDuration={4000}
      // 표시되는 위치
      anchorOrigin={location}
      message={message}
    >
      <Alert onClose={onClose} severity={color} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

Toast.defaultProps = {
  location: { vertical: 'bottom', horizontal: 'center' },
};
