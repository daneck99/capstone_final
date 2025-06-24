import { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import CallIcon from '@mui/icons-material/Call';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';

import { LabelItems } from '~/components/molecule/label';
import { useNavigationSelector } from '~/store/reducers/navigateSlice';
import ModalLabel from '~/components/molecule/modalLabel';
import { options, Status } from '~/types/radio';
import {
  CafePlaceContainer,
  CongestionBox,
  CongestionItem,
} from './cafeDetailInfo.styled';

interface CafePlaceInfoProps {
  address: string;
  phoneNumber: string;
  isCongestion: boolean;
  hasPlugCount: number;
  isCleanCount: number;
  viewerCount: number;
  seatVacantCount: number;
  seatTotalCount: number;
  cafeId: string;
}

interface PredictionItem {
  hour: number;
  percentage: number;
  status: Status;
  isCurrent: boolean;
  isPast: boolean;
}

const CafePlaceInfo = ({
  address,
  phoneNumber,
  isCongestion,
  hasPlugCount,
  isCleanCount,
  viewerCount,
  seatVacantCount,
  seatTotalCount,
  cafeId,
}: CafePlaceInfoProps) => {
  const theme = useTheme();
  const grayColor = theme.palette.grey[100];
  const iconColor = theme.palette.grey[300];
  const mainColor = theme.palette.primary.main;

  const navigate = useNavigationSelector();
  const [hourlyPredictions, setHourlyPredictions] = useState<PredictionItem[]>(
    []
  );
  const [recommendedVisitHours, setRecommendedVisitHours] =
    useState<string>('없음');
    new Date().getHours();
    const todayName = new Date().toLocaleString('en-US', { weekday: 'long' });
    const accessToken = useSelector(
    (state: RootState) => state.auth.auth.access_token
  );

  useEffect(() => {
    if (!cafeId) return;

    axios
      .get(`http://localhost:8080/api/congestion/cafe/${cafeId}`, {
        params: {
          day: todayName,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        const { data } = res;

        setHourlyPredictions(data);

        const recommended = data
          .filter((d) => d.status.toLowerCase() === 'spare')
          .map((d) => `${d.hour}시`)
          .join(', ');

        setRecommendedVisitHours(recommended || '없음');
        console.log(
          'spare 상태 개수:',
          data.filter((d) => d.status === Status.spare).length
        );
      })
      .catch((err) => {
        console.error('혼잡도 예측 데이터 요청 실패:', err);
      });
  }, [cafeId, todayName]);

  let status: Status = Status.unknown;
  if (seatTotalCount > 0) {
    const occupiedRatio = (seatTotalCount - seatVacantCount) / seatTotalCount;
    if (occupiedRatio <= 0.3) status = Status.spare;
    else if (occupiedRatio <= 0.7) status = Status.average;
    else status = Status.busy;
  }

  const viewerOption = options[status];

  const getStatusColor = (
    percentage: number,
    isPast: boolean,
    isCurrent: boolean
  ) => {
    if (isPast && !isCurrent) return '#BDBDBD';
    if (percentage <= 30) return '#4CAF50'; // 여유
    if (percentage <= 70) return '#FF9800'; // 보통
    return '#F44336'; // 혼잡
  };

  return (
    <CafePlaceContainer color={grayColor} icon={iconColor}>
      {/* 시청자 수 */}
      <Box
        sx={{
          backgroundColor: viewerOption.color2,
          color: viewerOption.color,
          padding: '8px 12px',
          borderRadius: '10px',
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '40px',
        }}
      >
        <Typography variant="subtitle2" textAlign="center">
          👀 현재{' '}
          <span style={{ color: '#ff4545', fontWeight: 'bold' }}>
            {viewerCount}
          </span>{' '}
          명이 보고 있어요
        </Typography>
      </Box>

      {/* 좌석 상태 */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          color: '#333',
          padding: '8px 12px',
          borderRadius: '10px',
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '36px',
        }}
      >
        <Typography variant="subtitle2" textAlign="center">
          🪑 실시간 좌석 상태: {seatVacantCount} / {seatTotalCount}
        </Typography>
      </Box>

      {/* 혼잡도 예측 */}
      <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}
        >
          <TrendingUpIcon sx={{ marginRight: '8px', color: mainColor }} />
          <Typography
            variant="h5"
            sx={{ color: mainColor, fontWeight: 'bold' }}
          >
            오늘 시간대별 혼잡도 예측
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: '#fafafa',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(10, 1fr)',
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            {hourlyPredictions.map((prediction) => {
              const { isCurrent } = prediction;
              const { isPast } = prediction;
              const color = getStatusColor(
                prediction.percentage,
                isPast,
                isCurrent
              );

              return (
                <Box key={prediction.hour} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      height: '40px',
                      backgroundColor: color,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '4px',
                      border: isCurrent
                        ? '2px solid #1976d2'
                        : '1px solid #ccc',
                      outline: isCurrent ? '2px solid #64b5f6' : 'none',
                      outlineOffset: '2px',
                      position: 'relative',
                      boxShadow: isCurrent ? '0 0 12px #64b5f6' : 'none',
                      transform: isCurrent ? 'scale(1.05)' : 'none',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'white', fontWeight: 'bold' }}
                    >
                      {prediction.percentage}%
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '10px',
                      fontWeight: isCurrent ? 'bold' : 'normal',
                      color: isCurrent ? '#1976d2' : '#333',
                    }}
                  >
                    {prediction.hour}시
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 추천 시간대 */}
        <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
          💡 추천 방문 시간대
        </Typography>
        <Box
          sx={{
            marginTop: '12px',
            padding: '12px',
            backgroundColor: '#e8f5e8',
            borderRadius: '8px',
          }}
        >
          <Typography variant="body2" sx={{ color: '#2e7d32' }}>
            {recommendedVisitHours}
          </Typography>
        </Box>
      </Box>

      {/* 매장 정보 */}
      <Typography variant="h4" mt="24px" mb="2px">
        매장 정보
      </Typography>
      <Box className="cafe-info">
        <PlaceIcon />
        <Typography variant="body2">{address}</Typography>
      </Box>
      <Box className="cafe-info">
        <CallIcon />
        <Typography variant="body2">{phoneNumber || '정보 없음'}</Typography>
      </Box>

      {isCongestion && (
        <CongestionBox>
          <CongestionItem>
            <LabelItems hasPlug isClean={false} />
            <Typography color={mainColor}>{hasPlugCount}</Typography>
          </CongestionItem>
          <CongestionItem>
            <LabelItems isClean hasPlug={false} />
            <Typography color={mainColor}>{isCleanCount}</Typography>
          </CongestionItem>
        </CongestionBox>
      )}
      {!isCongestion && navigate === 'search-detail' ? (
        <ModalLabel type="search" onClick={() => {}} />
      ) : (
        <ModalLabel onClick={() => {}} />
      )}
    </CafePlaceContainer>
  );
};

export default CafePlaceInfo;
