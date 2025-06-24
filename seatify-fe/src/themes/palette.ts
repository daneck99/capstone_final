import { PaletteOptions } from '@mui/material';

// MUI Theme에서 사용할 색상코드 정의 함수
const Palette = (): PaletteOptions => {
  return {
    primary: {
      main: '#6F4E37',
      dark: '',
    },
    secondary: {
      main: '#E3BA8A',
      dark: '',
    },
    background: {
      default: '#FFFFFFF',
      paper: '',
    },
    warning: {
      main: '#FF4258',
      dark: '',
    },
    error: {
      main: '#FF4545',
      dark: '',
    },
    info: {
      main: '#1A1A1A',
      dark: '',
    },
    grey: {
      50: '#FCFCFC',
      100: '#EFEFEF',
      200: '#DFDFDF',
      300: '#B7B7B7',
      400: '#949494',
      500: '#777777',
      600: '#555555',
      700: '#3F3F3F',
      800: '#2A2A2A',
      900: '#1A1A1A',
    },
  };
};
export default Palette;
