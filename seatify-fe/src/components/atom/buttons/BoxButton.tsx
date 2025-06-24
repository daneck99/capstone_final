import {
  Button,
  useTheme,
  styled,
  ButtonProps,
  Typography,
} from '@mui/material';

import { Color, Variant, Size } from '~/types/button';

interface StyleProps {
  padding: string;
  backgroundColor: string;
}

// Mateiral ui Button 커스텀
const MuiButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'padding' && prop !== 'backgroundColor',
})(({ padding, backgroundColor }: StyleProps) => ({
  backgroundColor,
  padding: padding as string,
  margin: 5,
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
  // 버튼 배경 색상
  color?: Color;
  // 버튼 모양
  variant?: Variant;
  // 버튼 사이즈
  padding?: Size;
}

const BoxButton = ({
  title,
  variant,
  color,
  padding,
  disabled,
  ...others
}: BoxButtonProps) => {
  const theme = useTheme();
  const typo =
    !disabled && variant === 'outlined' ? color : theme.palette.grey[700];

  // 버튼 색상 분기 처리
  let backgroundColor = color as string;
  if (color === 'secondary') {
    backgroundColor = theme.palette.grey[200] as string;
  }

  if (color === 'warning') {
    backgroundColor = theme.palette.warning.main as string;
  }

  // 비활성화인 경우
  if (disabled) {
    backgroundColor = theme.palette.grey[200] as string;
  }

  return (
    <MuiButton
      theme={theme}
      variant={variant}
      backgroundColor={backgroundColor as string}
      padding={PADDING[padding as Size]}
      disabled={disabled}
      {...others}
    >
      <Typography
        variant="button"
        // color={!disabled && variant === 'outlined' ? color : 'white'}
        color={color !== 'warning' ? typo : 'white'}
      >
        {title}
      </Typography>
    </MuiButton>
  );
};

BoxButton.defaultProps = {
  color: 'primary',
  variant: 'contained',
  padding: 'lg',
};

export default BoxButton;
