/* eslint-disable react/function-component-definition */
import { createContext, ReactNode, useCallback, useMemo } from 'react';

import useLocalStorage from '~/hooks/useLocalStorage';
import { FontFamily, ThemeMode, CustomizationProps } from '~/types/theme';

// MUI Theme 설정 초기값
const initialState: CustomizationProps = {
  fontFamily: 'PretendardRegular',
  mode: 'light',
  onChangeMode: () => {},
  onChangeFontFamily: () => {},
};

const ConfigContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactNode;
};

// 테마 설정 관련 주입
const ConfigProvider = ({ children }: ConfigProviderProps) => {
   
  const [config, setConfig] = useLocalStorage(
    'cafe-in-ts-config',
    initialState
  );

   
  const onChangeMode = useCallback(
    (mode: ThemeMode) => {
      setConfig({ ...config, mode });
    },
    [config, setConfig]
  );

   
  const onChangeFontFamily = useCallback(
    (fontFamily: FontFamily) => {
      setConfig({ ...config, fontFamily });
    },
    [config, setConfig]
  );

   
  const configContextProps = useMemo(
    () => ({
      ...config,
      onChangeMode,
      onChangeFontFamily,
    }),
    [config, onChangeFontFamily, onChangeMode]
  );

  return (
    <ConfigContext.Provider value={configContextProps}>
      {children}
    </ConfigContext.Provider>
  );
};

export { ConfigProvider, ConfigContext };
