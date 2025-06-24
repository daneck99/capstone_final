 

import { NextRequest, NextResponse } from 'next/server';

export const withoutAuth = async (req: NextRequest) => {
  try {
    const url = req.nextUrl.clone();
    url.pathname = '/';

    // 토큰이 있는 경우 => 메인 페이지로 redirect
    if (req.cookies.get('refreshToken')) {
      return NextResponse.rewrite(url);
    }

    // 토큰이 없는 경우 => 딱히 처리할 필요 x
    return NextResponse.next();
  } catch (err) {
    throw new Error('could not authenticate');
  }
};
