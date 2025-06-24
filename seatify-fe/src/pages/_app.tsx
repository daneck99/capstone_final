import '~/static/font-styles.css';

import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import { QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import GlobalStyle from '~/styles/global-styles';

import wrapper from '~/store';

import queryClient from '~/helpers/queryClient';
import { ConfigProvider } from '~/helpers/themeConfig';
import ThemeCustomization from '~/themes';
import EmptyLayout from '~/components/templates/EmptyLayout';
import MainLayout from '~/components/templates/MainLayout';

function MyApp({ Component, pageProps }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(pageProps);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Kakao SDK 초기화
  useEffect(() => {
    setIsClient(true); // useRouter() 안전 보장

    if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
    }
  }, []);

  if (!isClient) return null; // 클라이언트에서만 렌더링

  const DynamicLayout = router.pathname === '/login' ? EmptyLayout : MainLayout;

  return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedProps}>
            <ConfigProvider>
              <ThemeCustomization>
                <GlobalStyle />
                <DynamicLayout>
                  <Component {...props} />
                </DynamicLayout>
                <ReactQueryDevtools initialIsOpen={false} />
              </ThemeCustomization>
            </ConfigProvider>
          </Hydrate>
        </QueryClientProvider>
      </Provider>
  );
}

export default MyApp;
