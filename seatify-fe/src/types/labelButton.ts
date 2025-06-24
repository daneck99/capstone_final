 

import Clean from '~/static/svg/clean.svg';
import Power from '~/static/svg/power.svg';
import Bathroom from '~/static/svg/bathroom.svg';
import Menu from '~/static/svg/menu.svg';
import Atmosphere from '~/static/svg/atmosphere.svg';
import Seat from '~/static/svg/seat.svg';
import { Keywords } from './comment';

export enum Select {
  'clean', // 청결도
  'power', // 콘센트
  'bathroom', // 화장실
  'menu', // 메뉴
  'seat', // 좌석
  'atmosphere', // 분위기
}

export const selectArray: Select[] = [
  Select.clean,
  Select.power,
  Select.bathroom,
  Select.menu,
  Select.seat,
  Select.atmosphere,
];

export interface Option {
  title: Keywords;
  imgSvg: string;
}

export type SelectOption = {
  [key in Select]: Option;
};

export const selectOptions: SelectOption = {
  [Select.clean]: {
    title: '청결도',
    imgSvg: Clean,
  },
  [Select.power]: {
    title: '콘센트',
    imgSvg: Power,
  },
  [Select.bathroom]: {
    title: '화장실',
    imgSvg: Bathroom,
  },
  [Select.menu]: {
    title: '메뉴',
    imgSvg: Menu,
  },
  [Select.seat]: {
    title: '좌석',
    imgSvg: Seat,
  },
  [Select.atmosphere]: {
    title: '분위기',
    imgSvg: Atmosphere,
  },
};
