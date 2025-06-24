 

import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export, consistent-return
export async function withAuth(req: NextRequest) {
  try {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    // 토큰이 쿠키에 있는 경우 => 딱히 처리 X
    if (req.cookies.get('refreshToken')) {
      // 쿠키에 있는 토큰 refresh token이 만료일이 넘어가면 로그인 페이지로 redirect
      return NextResponse.next();
    }
    // 토큰이 쿠키에 없는 경우 => 로그인 페이지로 redirect
    return NextResponse.rewrite(url);
  } catch (err) {
    throw new Error('could not authenticate');
  }
}
