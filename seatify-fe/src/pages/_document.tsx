/* eslint-disable @next/next/no-sync-scripts */
// script eslint 에러 => Synchronous scripts should not be used
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets } from '@mui/styles';

// mui와 styled-components가 next.js에서 작동하도록 설정

// 카카오 api를 활용하기 위해 sdk를 추가해줘야 함
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="https://developers.kakao.com/sdk/js/kakao.js" />
          <script defer src="/components/molecule/googleMap/index.tsx" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheet = new ServerStyleSheet();
  const materialSheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  try {
    // cts eslint 에러 => Assignment to property of function parameter 'ctx'
    // eslint-disable-next-line no-param-reassign
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) =>
          sheet.collectStyles(materialSheets.collect(<App {...props} />)),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {sheet.getStyleElement()}
        </>
      ),
    };
  } finally {
    sheet.seal();
  }
};
