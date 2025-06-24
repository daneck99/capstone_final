import { PaletteOptions } from '@mui/material';
import {
  CustomTypographyVariantsOptions,
  FontFamily,
  ThemeMode,
} from '~/types/theme';

// MUI Theme에서 사용할 text style 값들을 미리 정의한 함수
const Typography = (
  mode: ThemeMode,
  fontFamily: FontFamily,
  palette: PaletteOptions
): CustomTypographyVariantsOptions => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightRegular: 100,
  fontWeightMedium: 200,
  fontWeightSemiBold: 300,
  fontWeightBold: 400,
  fontWeightExtraBold: 500,
  // Title1
  h1: {
    fontFamily: 'PretendardBold',
    fontWeight: 600,
    fontSize: '24px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Title2
  h2: {
    fontFamily: 'PretendardBold',
    fontWeight: 600,
    fontSize: '22px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Title3
  h3: {
    fontFamily: 'PretendardBold',
    fontWeight: 600,
    fontSize: '20px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Title4
  h4: {
    fontFamily: 'PretendardBold',
    fontWeight: 600,
    fontSize: '18px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Title5
  h5: {
    fontFamily: 'PretendardBold',
    fontWeight: 600,
    fontSize: '16px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
    lineHeight: 1.5,
  },
  // Body1
  body1: {
    fontFamily: 'PretendardMedium',
    fontSize: '15px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Body2
  body2: {
    fontFamily: 'PretendardMedium',
    fontSize: '14px',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Body3
  subtitle1: {
    fontFamily: 'PretendardMedium',
    fontSize: '13px',
    fontWeight: 600,
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  // Body4
  subtitle2: {
    fontFamily: 'PretendardMedium',
    fontSize: '12px',
    fontWeight: 500,
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
    lineHeight: 1.5,
  },
  // Body5
  caption: {
    fontFamily: 'PretendardMedium',
    fontSize: '11px',
    fontWeight: 500,
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  overline: {
    lineHeight: 1.66,
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
  button: {
    fontFamily: 'PretendardRegular',
    textTransform: 'capitalize',
    color: mode === 'light' ? palette.grey?.[900] : palette.grey?.[50],
  },
});

export default Typography;
