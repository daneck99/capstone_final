 

import { EngKeywords } from './comment';

export interface CafeInfo {
  cafeId: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  status: string; // DB에 status 컬럼 존재
  rating: string; // ✅ 추가됨
  openingHours: string; // ✅ JSON 문자열 (파싱 가능)
  reviews: string; // ✅ JSON 문자열
  commentReviewCount?: string; // optional: 리뷰/댓글 수 합산
  hasPlugCount: number;
  isCleanCount: number;
}

export interface CafesInfo {
  cafeCount: number;
  cafes: CafesInfo[];
}

export interface Comment {
  commentId: string;
  memberName: string;
  createdTime: string;
  content: string;
  keywords: EngKeywords[] | [];
  rating: number; // 추가된 rating 필드
}
export interface CafeComment {
  cafeInfo: CafeInfo;
  comments: Comment[] | [];
}
