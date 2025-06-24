 

export type TCafeCongestion = '1' | '2' | '3' | '0';

export interface RadioProps {
  status: TCafeCongestion;
}

export interface RadioStatusProps {
  status: '1' | '2' | '3' | '0';
  onClick?: () => void;
}

export enum Status {
  unknown = '0', // 모름
  spare = '1', // 여유
  average = '2', // 보통
  busy = '3', // 혼잡
}

export interface Option {
  color: string;
  color2: string;
  label: string;
  label2: string;
}

export type RadioOption = {
  [key in Status]: Option;
};

// 카페 옵션에 따른 status 이름과 색 지정
export const options: RadioOption = {
  [Status.unknown]: {
    color: '#949494',
    color2: 'white',
    label: '실시간 혼잡도 알아보기',
    label2: '실시간 혼잡도 알아보기',
  },
  [Status.spare]: {
    color: '#1eda00',
    color2: '#EBFFE8',
    label: '여유',
    label2: '여유로워요',
  },
  [Status.average]: {
    color: '#ffa011',
    color2: '#FFF4E4',
    label: '보통',
    label2: '보통이에요',
  },
  [Status.busy]: {
    color: '#ff4545',
    color2: '#FFF5F5',
    label: '혼잡',
    label2: '혼잡해요',
  },
};
