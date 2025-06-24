 

export enum Review {
  'cafeCongestion' = 'cafeCongestion',
  'hasPlug' = 'hasPlug',
  'isClean' = 'isClean',
}

export const ReviewArray: Review[] = [
  Review.cafeCongestion,
  Review.hasPlug,
  Review.isClean,
];

export interface Option {
  title: string;
  select: string[];
  selectValue: string[];
}

export type ReviewOption = {
  [key in Review]: Option;
};

export const reviewOptions: ReviewOption = {
  [Review.cafeCongestion]: {
    title: '현재 카페 내부 혼잡도는 어떤가요?',
    select: ['혼잡', '보통', '여유'],
    selectValue: ['3', '2', '1'],
  },
  [Review.isClean]: {
    title: '매장은 깨끗한 편인가요?',
    select: ['네', '아니오'],
    selectValue: ['true', 'false'],
  },
  [Review.hasPlug]: {
    title: '콘센트를 사용할 수 있는 자리가 많은 편인가요?',
    select: ['많아요', '적어요'],
    selectValue: ['true', 'false'],
  },
};
