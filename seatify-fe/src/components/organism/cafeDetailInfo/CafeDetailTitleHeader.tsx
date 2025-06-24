import { useTheme } from '@mui/material';

import { CafeInfo } from '~/types/cafeInfo';
import CafeDetailTitle from './CafeDetailTitle';
import { CafeContentContainer } from './cafeDetailInfo.styled';
import CafeCongestionStatus from "~/components/organism/cafeDetailInfo/CafeCongestionStatus";

const decodeHtmlEntities = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

const getOpenStatusWithHours = (
    openingHours: string | null | undefined
): { status: '영업중' | '영업종료' | '영업정보없음'; todayHours: string } => {
  if (!openingHours || openingHours === '{}') {
    return { status: '영업정보없음', todayHours: '-' };
  }

  try {
    const decoded = decodeHtmlEntities(openingHours);
    const parsed = JSON.parse(decoded);
    const now = new Date();
    const currentDay = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let period = parsed?.periods?.find((p: any) => p?.open?.day === currentDay);
    if (!period && parsed?.periods?.length === 1 && parsed.periods[0]?.open?.day === 0) {
      period = parsed.periods[0]; // 모든 요일 동일하게 간주
    }

    if (!period || !period.open) {
      return { status: '영업정보없음', todayHours: '-' };
    }

    const openHour = period.open.hour ?? 0;
    const openMinute = period.open.minute ?? 0;
    const openTime = openHour * 60 + openMinute;

    // ✅ 24시간 영업: close 없음 + 자정
    if (!period.close && openTime === 0) {
      return { status: '영업중', todayHours: '24시간 영업' };
    }

    if (!period.close) {
      return { status: '영업정보없음', todayHours: '-' };
    }

    const closeHour = period.close.hour ?? 0;
    const closeMinute = period.close.minute ?? 0;
    const closeTime = closeHour * 60 + closeMinute;

    const isOpen =
        closeTime <= openTime
            ? nowMinutes >= openTime || nowMinutes < closeTime
            : nowMinutes >= openTime && nowMinutes < closeTime;

    const formatTime = (h: number, m: number) =>
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    const todayHours = `${formatTime(openHour, openMinute)} ~ ${formatTime(
        closeHour,
        closeMinute
    )}`;

    return { status: isOpen ? '영업중' : '영업종료', todayHours };
  } catch (e) {
    console.error('openingHours 파싱 에러:', e);
    return { status: '영업정보없음', todayHours: '-' };
  }
};



interface DetailProps {
  data: CafeInfo;
  seatCongestion: '1' | '2' | '3';  // ✅ 새로 추가
  token: string;                   // 좌석 조회할 수도 있으므로 필요시 추가
}

const CafeDetailTitleHeader = ({ data, seatCongestion }: DetailProps) => {
  const theme = useTheme();
  const grayColor = theme.palette.grey[100];
  const openingHours = data.openingHours;

  const { status: openStatusText, todayHours } = getOpenStatusWithHours(openingHours);

  return (
      <CafeContentContainer color={grayColor}>
        <CafeDetailTitle
            name={data.name}
            openStatus={openStatusText}
            openingHourText={todayHours}
            address={data.address}
        />
        <CafeCongestionStatus congestion={seatCongestion} />
      </CafeContentContainer>
  );
};


export default CafeDetailTitleHeader;