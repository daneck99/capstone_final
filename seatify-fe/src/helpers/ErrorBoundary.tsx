 

import {
  Component,
  ComponentType,
  createElement,
  ReactNode,
  ErrorInfo,
} from 'react';
import { getAccessToken } from '~/pages/api/user';
import { setToken } from '~/store/reducers/authSlice';
import { getCookie } from './cookie';

type ErrorBoundaryState = {
  hasError: boolean;
  error: any | null; // 에러 타입 정의해줘야 함
};

type FallbackProps = {
  error: any | null;
};

type ErrorBoundaryProps = {
  // fallback 용도의 컴포넌트는 Error 정보를 props로 받을 수 있는 컴포넌트여야 한다.
  dispatch: any;
  fallback: ComponentType<FallbackProps>;
  children: ReactNode;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false, // 오류가 발생했는지 여부를 state 상태로 저장
      error: null, // 발생한 오류의 정보를 state 상태로 저장
    };
  }

  /*
    getDerivedStateFromError 메소드는 하위 컴포넌트에서 오류의 정보를 return을 통해서 State에 저장하는 역할을 합니다.
    error 파라미터는 발생한 오류의 정보를 담고 있습니다.
  */
  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    // 오류 상태 업데이트
    return {
      hasError: true,
      error,
    };
  }

  /* componentDidCatch 메소드는 오류 정보와 상세 정보를 파라미터로 얻을 수 있습니다.
    주로 오류를 로깅해야 할때 해당 메소드에 접근해서 로깅할 수 있습니다. 
  */
  async componentDidCatch(error: any, errorInfo: ErrorInfo) {
    const { dispatch } = this.props;
    if (error.errorCode === 'A-001') {
      try {
        console.log('실행은 되는거니');
        const refreshToken = getCookie('refreshToken');
        const accessTokenResponse = await getAccessToken(refreshToken);
        const { accessToken } = accessTokenResponse;

        // access token을 리덕스에 저장하는 액션 디스패치
        dispatch(setToken({ access_token: accessToken }));
      } catch (e) {
        console.log('처리중에서 에러', e, '정보는', errorInfo);
      }
    }
  }

  render() {
    const { state, props } = this;

    const { hasError, error } = state;

    const { fallback, children } = props;

    const fallbackProps: FallbackProps = {
      error,
    };

    // fallback 컴포넌트 측에서 오류 정보를 props로 받을 수 있도록 설정
    const fallbackComponent = createElement(fallback, fallbackProps);

    // 오류 발생 여부를 체크하여, 오류가 발생했을때 조건부 렌더링 처리를 해줍니다.
    return hasError ? fallbackComponent : children;
  }
}
