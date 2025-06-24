 

export type Keywords =
  | '청결도'
  | '콘센트'
  | '화장실'
  | '메뉴'
  | '좌석'
  | '분위기';

export type EngKeywords =
  | 'CLEAN'
  | 'SEAT'
  | 'PLUG'
  | 'MOOD'
  | 'RESTROOM'
  | 'MENU';

export enum Keyword {
  clean = 'CLEAN',
  seat = 'SEAT',
  plug = 'PLUG',
  mood = 'MOOD',
  restroom = 'RESTROOM',
  menu = 'MENU',
}

export interface Option {
  title: Keywords;
}

export type KeywordOption = {
  [key in Keyword]: Option;
};

// 백엔드 api로 보내주는 keyword에 대응되는 string
export const keywordOptions: KeywordOption = {
  [Keyword.clean]: {
    title: '청결도',
  },
  [Keyword.seat]: {
    title: '좌석',
  },
  [Keyword.plug]: {
    title: '콘센트',
  },
  [Keyword.mood]: {
    title: '분위기',
  },
  [Keyword.restroom]: {
    title: '화장실',
  },
  [Keyword.menu]: {
    title: '메뉴',
  },
};
