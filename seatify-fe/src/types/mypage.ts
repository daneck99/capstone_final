import { TCafeCongestion } from './radio';

export type TMyPageTabKey = 'recently' | 'post';

export interface MyPageTab {
  label: string;
  value: TMyPageTabKey;
}

// 최근 검색한 카페 정보
export interface CafeInfoView {
  // 카페 주소
  address: string;
  // 카페 이름
  cafeName: string;
  // 카페 리뷰 개수
  commentReviewCount: string;
}

// 리뷰한 카페 정보
export interface Review {
  // 카페 주소
  address: string;
  // 카페 혼잡도
  cafeCongestion: TCafeCongestion;
  // 카페 이름
  cafeName: string;
  // 카페에 플러그가 있는지에 대한 리뷰
  hasPlug: boolean;
  // 카페가 청결한지에 대한 리뷰
  isClean: boolean;
}

// 마이페이지
export interface MyPageResponse {
  // 최근 검색한 카페 목록
  cafeInfoViewedByMemberDTOS: CafeInfoView[];
  // 리뷰 개수
  reviewCount: number;
  // 리뷰남긴 카페 목록
  reviewDTOS: Review[];
}
