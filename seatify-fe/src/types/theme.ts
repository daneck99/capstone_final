import { ButtonProps, Theme, TypographyVariantsOptions } from '@mui/material';

export type ThemeMode = 'light' | 'dark';

export type FontFamily =
  | 'PretendardExtraBold'
  | 'PretendardBold'
  | 'PretendardSemiBold'
  | 'PretendardMedium'
  | 'PretendardRegular';

export type FontStyle = 'normal' | 'italic' | undefined;

export type DefaultConfigProps = {
  fontFamily: FontFamily;
  mode: ThemeMode;
};

export interface CustomTypographyVariantsOptions
  extends TypographyVariantsOptions {
  fontWeightSemiBold: number;
  fontWeightExtraBold: number;
}

export interface CustomizationProps {
  fontFamily: FontFamily;
  mode: ThemeMode;
  onChangeMode: (mode: ThemeMode) => void;
  onChangeFontFamily: (fontFamily: FontFamily) => void;
}

export type ColorProps = ButtonProps['color'];

export interface ExtendedStyleProps {
  color?: ColorProps;
  theme?: Theme;
}
