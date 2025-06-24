import { NextRequest, NextResponse } from 'next/server';

import { withAuth } from './helpers/withAuth';
import { withoutAuth } from './helpers/withoutAuth';

export const middleware = async (req: NextRequest) => {
  // 로그인 페이지에서 미들웨어 처리
  if (req.nextUrl.pathname.startsWith('/login')) {
    return withoutAuth(req);
  }

  // 메인페이지에서 미들웨어 처리
  if (req.nextUrl.pathname.startsWith('/')) {
    return withAuth(req);
  }

  return NextResponse.next();
};

export const config = {
  // 특정 경로에서 Middleware가 실행되도록 필터링
  matcher: '/',
};
