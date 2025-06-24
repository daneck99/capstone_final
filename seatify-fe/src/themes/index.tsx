/* eslint-disable react/function-component-definition */
import React, { useMemo } from 'react';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  PaletteOptions,
} from '@mui/material';
import { Theme, createTheme } from '@mui/material/styles';

import { CustomTypographyVariantsOptions } from '~/types/theme';
import useConfig from '~/hooks/useConfig';
import Palette from './palette';
import Typography from './typography';

// MUI Theme 설정 커스텀 파일
const ThemeCustomization = ({ children }: React.PropsWithChildren) => {
  const { mode, fontFamily } = useConfig();

  const palette: PaletteOptions = useMemo<PaletteOptions>(
    () => Palette(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode]
  );

  const typography: CustomTypographyVariantsOptions =
    useMemo<CustomTypographyVariantsOptions>(
      () => Typography(mode, fontFamily, palette),
      [mode, fontFamily, palette]
    );

  const theme: Theme = useMemo(
    () => createTheme({ palette, typography }),
    [palette, typography]
  );

  return (
     
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeCustomization;
