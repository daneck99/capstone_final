import { useContext } from 'react';

import { ConfigContext } from '~/helpers/themeConfig';

// MUI Theme 설정 값, 변경 함수 훅
const useConfig = () => useContext(ConfigContext);

export default useConfig;
