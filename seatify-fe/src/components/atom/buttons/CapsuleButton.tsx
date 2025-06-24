import {
  Button,
  useTheme,
  styled,
  ButtonProps,
  Typography,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';

import { Variant, Size } from '~/types/button';

interface StyleProps {
  padding: string;
  borderColor: string;
}

// Mateiral ui Button 커스텀
const MuiButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'padding' && prop !== 'borderColor',
})(({ padding, borderColor }: StyleProps) => ({
  borderColor,
  padding: padding as string,
  margin: 5,
  borderRadius: '30%',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor,
  },
}));

// 패딩 사이즈 표
const PADDING = {
  xl: '14px 17.5px',
  lg: '12px 14px',
  md: '10px 12px',
  sm: '8px 12px',
};

interface BoxButtonProps extends ButtonProps {
  // 버튼명
  title: string;
  // 버튼 모양
  variant?: Variant;
  // 버튼 사이즈
  padding?: Size;
}

// 박스형 버튼
const CapsuleButton = ({
  title,
  variant,
  padding,
  disabled,
  ...others
}: BoxButtonProps) => {
  const theme = useTheme();

  const [isActive, setIsActive] = useState(false);

  const colors = useMemo(() => {
    return {
      // 버튼 Down 색상
      active: theme.palette.grey[900],
      // 버튼 Up 색상
      inactive: theme.palette.grey[100],
      inactiveText: theme.palette.grey[400],
    };
  }, [theme.palette.grey]);

  const handleMounseDown = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleMounseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <MuiButton
      theme={theme}
      variant={variant}
      borderColor={isActive ? colors.active : colors.inactive}
      padding={PADDING[padding as Size]}
      disabled={disabled}
      onMouseDown={handleMounseDown}
      onMouseUp={handleMounseUp}
      disableRipple
      {...others}
    >
      <Typography
        variant="h5"
        color={isActive ? colors.active : colors.inactiveText}
      >
        {title}
      </Typography>
    </MuiButton>
  );
};

CapsuleButton.defaultProps = {
  variant: 'outlined',
  padding: 'lg',
};

export default CapsuleButton;
