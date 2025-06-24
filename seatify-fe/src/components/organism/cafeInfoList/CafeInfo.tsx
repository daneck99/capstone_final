import {
  ListItem,
  ListItemButton,
  Typography,
  useTheme,
} from '@mui/material';
import { RadioStatusButton } from '~/components/molecule/radioButtons';
import { CafeInfo } from '~/types/cafeInfo';
import { CafeStatusTypography } from '~/components/organism/cafeDetailInfo/cafeDetailInfo.styled';
import { useEffect, useState } from 'react';
import { fetchSeats } from '~/pages/api/seat/getSeats';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';
import { CafeBox, CafeInfoTitle } from './cafeInfo.styled';

interface CafeInfoProp {
  cafeClickHandler: () => void;
  cafes: CafeInfo;
}

// ✅ SSR 환경에서는 window 객체가 없기 때문에 안전하게 체크
const isBrowser = typeof window !== 'undefined';

// ✅ HTML entity decoding 함수 (브라우저 환경에서만 실행)
const decodeHtmlEntities = (str: string) => {
  if (!isBrowser) return str;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// ✅ 카페 영업 여부 계산 함수 (브라우저에서만 동작)
const getOpenStatus = (openingHours: string | null | undefined): '영업중' | '영업종료' | '영업정보없음' => {
  if (!openingHours || openingHours === '{}') return '영업정보없음';

  try {
    const decoded = decodeHtmlEntities(openingHours);
    const parsed = JSON.parse(decoded);
    const now = new Date();
    const currentDay = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    // 🔧 현재 요일에 해당하는 period 또는 fallback: day=0만 있을 경우 모든 요일에 동일하게 간주
    let period = parsed?.periods?.find((p: any) => p?.open?.day === currentDay);
    if (!period && parsed?.periods?.length === 1 && parsed.periods[0]?.open?.day === 0) {
      period = parsed.periods[0]; // 모든 요일 동일하다고 간주
    }

    if (!period || !period.open) return '영업정보없음';

    const openTime = (period.open.hour ?? 0) * 60 + (period.open.minute ?? 0);
    if (!period.close && openTime === 0) return '영업중'; // 24시간
    if (!period.close) return '영업정보없음';

    const closeTime = (period.close.hour ?? 0) * 60 + (period.close.minute ?? 0);
    const isOpen =
        closeTime <= openTime
            ? nowMinutes >= openTime || nowMinutes < closeTime
            : nowMinutes >= openTime && nowMinutes < closeTime;

    return isOpen ? '영업중' : '영업종료';
  } catch (e) {
    console.error('openingHours 파싱 에러:', e);
    return '영업정보없음';
  }
};


const CafeInfo = ({ cafeClickHandler, cafes }: CafeInfoProp) => {
  const theme = useTheme();
  const grayColor = theme.palette.grey[100];
  const token = useSelector((state: RootState) => state.auth.auth.access_token);

  const [openStatus, setOpenStatus] = useState('영업정보없음');
  const [seatStatus, setSeatStatus] = useState<'1' | '2' | '3' | 'unknown'>('unknown');

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const data = await fetchSeats(cafes.cafeId, token);
        if (!data || data.length === 0) {
          setSeatStatus('unknown');
          return;
        }

        const occupied = data.filter((s) => s.occupied).length;
        const ratio = occupied / data.length;
        const level = ratio <= 0.3 ? '1' : ratio <= 0.7 ? '2' : '3';
        setSeatStatus(level);
      } catch (e) {
        console.warn('좌석 정보 불러오기 실패', e);
        setSeatStatus('unknown');
      }
    };
    fetchSeatData();
  }, [cafes.cafeId, token]);


  // ✅ 클라이언트에서만 영업 상태 계산
  useEffect(() => {
    if (isBrowser && cafes.openingHours && cafes.openingHours !== '{}') {
      const status = getOpenStatus(cafes.openingHours);
      setOpenStatus(status);
    }
  }, [cafes.openingHours]);

  const statusColor =
      openStatus === '영업중'
          ? '#bbeba7'
          : openStatus === '영업정보없음'
              ? grayColor
              : '#f2c8c4';

  return (
      <ListItem>
        <ListItemButton onClick={cafeClickHandler}>
          <CafeBox>
            <CafeInfoTitle>
              <Typography variant="h5" mr="4px">
                {cafes.name}
              </Typography>
              <RadioStatusButton status={seatStatus} />
            </CafeInfoTitle>

            <Typography variant="body2" mt="5px">
              {cafes.address}
            </Typography>

            <CafeInfoTitle>
              <CafeStatusTypography color={statusColor} variant="subtitle2">
                {openStatus}
              </CafeStatusTypography>
              <Typography
                  variant="subtitle2"
                  color="grey"
                  mt="12px"
                  mb="10px"
                  ml="10px"
              >
                후기{cafes.commentReviewCount}
              </Typography>
            </CafeInfoTitle>
          </CafeBox>
        </ListItemButton>
      </ListItem>
  );
};

export default CafeInfo;
