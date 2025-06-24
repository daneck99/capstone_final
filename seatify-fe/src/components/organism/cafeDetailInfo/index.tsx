import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  Typography,
} from '@mui/material';
import { CafeInfo } from '~/types/cafeInfo';
import SeatList from '~/components/organism/seatList/SeatList';
import ReviewList from '~/components/organism/reviewList/ReviewList';
import CommunityCommentList from '~/components/organism/communityCommentList/CommunityCommentList';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import getAllCafeInfo from '~/pages/api/home/getAllCafeInfo';
import { useQuery } from '@tanstack/react-query';
import { fetchSeats } from '~/pages/api/seat/getSeats';
import { setCafeId } from '~/store/reducers/cafeIdSlice';
import { setNavigationContent } from '~/store/reducers/navigateSlice';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import CafeDetailTitleHeader from './CafeDetailTitleHeader';
import { CafeDetailContainer } from './cafeDetailInfo.styled';
import CafePlaceInfo from './CafePlaceInfo';

interface DetailProps {
  data: CafeInfo;
}

const decodeHtmlEntities = (str: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.value;
};

// ✅ currentTime → "mm-ss" 포맷 변환 함수
const formatCurrentTimeToFrameName = (currentTime: number): string => {
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  return `${minutes.toString().padStart(2, '0')}-${seconds
    .toString()
    .padStart(2, '0')}`;
};

const isCafeOpenNow = (openingHoursJson: string | null) => {
  if (!openingHoursJson) return false;
  try {
    const decoded = decodeHtmlEntities(openingHoursJson);
    const openingHours = JSON.parse(decoded);
    const now = new Date();
    const currentDay = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const period = openingHours?.periods?.find(
      (p: any) => p.open.day === currentDay
    );
    if (!period || !period.open) return false;

    const openMinutes =
      (period.open.hour ?? 0) * 60 + (period.open.minute ?? 0);

    // ✅ 24시간 영업 조건 처리: close가 없고 open이 00:00이면 24시간으로 간주
    if (!period.close && openMinutes === 0) return true;

    if (!period.close) return false;

    const closeMinutes =
      (period.close.hour ?? 0) * 60 + (period.close.minute ?? 0);

    if (closeMinutes <= openMinutes) {
      return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
    }
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  } catch (err) {
    console.error('openingHours 파싱 에러:', err);
    return false;
  }
};

const CafeDetailInfo = ({ data }: DetailProps) => {
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [viewerCount, setViewerCount] = useState<number>(0);
  const [recommendOpen, setRecommendOpen] = useState(false);
  const [recommendedCafe, setRecommendedCafe] = useState<CafeInfo | null>(null);
  const [recommendedViewerCount, setRecommendedViewerCount] = useState<
    number | null
  >(null);
  const [recommendedSeatInfo, setRecommendedSeatInfo] = useState<{
    total: number;
    vacant: number;
  } | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [seatInfo, setSeatInfo] = useState({ total: 0, vacant: 0 });
  const [seatCongestion, setSeatCongestion] = useState<'1' | '2' | '3'>('1');
  const videoRef = useRef<HTMLVideoElement>(null); // ✅ 비디오 ref 추가
  const analyzeIntervalRef = useRef<number | null>(null); // ▶ setInterval ID 보관
  const isAnalyzingRef = useRef(false); // ▶ 이전 분석 중복 방지
  const [hasShownRecommend, setHasShownRecommend] = useState(false);

  const currentCafe = data.cafeInfo;
  const decodedReviews =
    typeof currentCafe.reviews === 'string'
      ? JSON.parse(decodeHtmlEntities(currentCafe.reviews))
      : currentCafe.reviews;

  const token = useSelector((state: RootState) => state.auth.auth.access_token);
  const { data: allCafes } = useQuery<CafeInfo[]>(
    ['cafeList'],
    () => getAllCafeInfo(token),
    { enabled: !!token }
  );

  const dispatch = useDispatch();

  const handleClickOpen = async () => {
    setOpen(true);
    const currentTime = videoRef.current?.currentTime || 0;
    const ts = currentTime.toFixed(2);
    const timeStr = formatCurrentTimeToFrameName(currentTime);

    try {
      await axios.get('http://localhost:5001/detect-frame-run1', {
        params: { time: timeStr, store_id: currentCafe.cafeId },
      });
      await axios.get('http://localhost:5001/detect-frame-run2', {
        params: { time: timeStr, store_id: currentCafe.cafeId },
      });
      console.log(`📸 초기 프레임 분석 완료 (ts=${ts})`);
    } catch (err) {
      console.error('❌ 초기 프레임 분석 실패:', err);
    }

    analyzeIntervalRef.current = window.setInterval(async () => {
      if (!videoRef.current || isAnalyzingRef.current) return;
      isAnalyzingRef.current = true;

      const { currentTime } = videoRef.current;
      const timeStr = formatCurrentTimeToFrameName(currentTime); // ✅ 고정 포맷 사용

      try {
        const res1 = await axios.get(
          'http://localhost:5001/detect-frame-run1',
          {
            params: { time: timeStr, store_id: currentCafe.cafeId },
          }
        );

        const res2 = await axios.get(
          'http://localhost:5001/detect-frame-run2',
          {
            params: { time: timeStr, store_id: currentCafe.cafeId },
          }
        );

        console.log(`✅ AI 분석 완료 (ts=${timeStr})`);
        if (res2.data.seats) setSeats(res2.data.seats);
      } catch (err) {
        console.warn(`❌ 분석 요청 실패 (ts=${timeStr}):`, err);
      } finally {
        isAnalyzingRef.current = false;
      }
    }, 1000);
  };

  //* *"현재 프레임 추론 버튼"**을 추가
  const handleDetectFrame = async () => {
    if (!videoRef.current) return;
    const timeStr = formatCurrentTimeToFrameName(videoRef.current.currentTime);
    try {
      const res = await axios.get('http://localhost:5001/detect-frame-run2', {
        params: { time: timeStr, store_id: currentCafe.cafeId },
      });
      console.log('Detect 결과:', res.data);
      alert(`✅ ${timeStr} 시점의 프레임 추론이 완료되었습니다.`);
    } catch (err) {
      console.error('프레임 추론 실패:', err);
      alert('❌ 프레임 추론에 실패했습니다.');
    }
  };

  // 2️⃣ 모달 닫을 때: 타이머 중단 & detect-stop
  const handleClose = async () => {
    setOpen(false);
    if (analyzeIntervalRef.current !== null) {
      clearInterval(analyzeIntervalRef.current);
      analyzeIntervalRef.current = null;
    }
    try {
      await axios.post('http://localhost:5001/stop-detect', {
        cafeId: currentCafe.cafeId,
      });
      console.log('🛑 Detection 중지 요청 성공');
    } catch (err) {
      console.error('❌ Detection 중지 요청 실패:', err);
    }
  };

  // ✅ 영상 자동재생 안정성 보장
  useEffect(() => {
    if (open && currentCafe.cafeId === '20' && videoRef.current) {
      const videoEl = videoRef.current;
      videoEl.play().catch((e) => {
        console.warn('Autoplay 실패:', e);
      });
    }
  }, [open, currentCafe.cafeId]);

  const handleCommentDialogOpen = () => setCommentOpen(true);
  const handleCommentDialogClose = () => setCommentOpen(false);

  const handleSelectRecommendedCafe = () => {
    if (recommendedCafe) {
      dispatch(setCafeId({ cafeId: recommendedCafe.cafeId, commentId: '0' }));
      dispatch(setNavigationContent('content'));
      setRecommendOpen(false);
    }
  };

  // 좌석 데이터 가져오기 (polling용)
  const fetchSeatData = async () => {
    if (!token || !currentCafe?.cafeId) return;
    try {
      const data = await fetchSeats(currentCafe.cafeId, token);
      setSeats(data);

      const occupied = data.filter((s) => s.occupied).length;
      const vacant = data.length - occupied;
      setSeatInfo({ total: data.length, vacant });

      const ratio = occupied / data.length;
      setSeatCongestion(ratio <= 0.3 ? '1' : ratio <= 0.7 ? '2' : '3');
    } catch (e) {
      console.warn('좌석 정보 불러오기 실패', e);
    }
  };

  const calculateDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchViewerCount = async () => {
      if (!currentCafe?.cafeId || !token || !allCafes) return;
      try {
        const res = await fetch(
          `http://localhost:8080/api/cafe-view/count?cafe_id=${currentCafe.cafeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const result = await res.json();
        setViewerCount(result);

        const congestionWeight =
          seatCongestion === '3' ? 2 : seatCongestion === '2' ? 1 : 0;
        const VIEWER_THRESHOLD = 1;

        if (congestionWeight * result >= 1 && !recommendOpen) {
          // 1️⃣ 후보 필터링 + 거리 계산
          const candidatesWithDistance = allCafes
            .filter(
              (candidate) =>
                candidate.cafeId !== currentCafe.cafeId &&
                isCafeOpenNow(candidate.openingHours)
            )
            .map((candidate) => {
              const distance = calculateDistanceKm(
                parseFloat(currentCafe.latitude),
                parseFloat(currentCafe.longitude),
                parseFloat(candidate.latitude),
                parseFloat(candidate.longitude)
              );
              return { candidate, distance };
            });

          // 2️⃣ 거리 정규화
          const distances = candidatesWithDistance.map((c) => c.distance);
          const minDist = Math.min(...distances);
          const maxDist = Math.max(...distances);

          // 3️⃣ 추천 점수 계산
          const scoredCandidates = [];
          for (const { candidate, distance } of candidatesWithDistance) {
            const altRes = await fetch(
              `http://localhost:8080/api/cafe-view/count?cafe_id=${candidate.cafeId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const altViewer = await altRes.json();

            const seatRes = await fetchSeats(candidate.cafeId, token);
            const occupied = seatRes.filter((s) => s.occupied).length;
            const vacant = seatRes.length - occupied;
            const vacantRatio = vacant / (seatRes.length || 1);

            const distanceScore = 1 / (distance + 0.01); // 0.01은 0 나눔 방지

            const score =
              0.5 * vacantRatio + 0.5 * distanceScore + 0.2 * altViewer;

            console.log(
              `[거리 체크] 기준 카페: ${currentCafe.name}, 후보: ${
                candidate.name
              }, 거리: ${distance.toFixed(2)}거리 점수: ${distanceScore.toFixed(
                2
              )}`
            );

            scoredCandidates.push({
              ...candidate,
              score,
              altViewer,
              seatInfo: { total: seatRes.length, vacant },
            });
          }

          // 4️⃣ 점수순 정렬 및 추천 설정
          const sorted = scoredCandidates.sort((a, b) => b.score - a.score);
          for (const candidate of sorted) {
            if (candidate.altViewer < VIEWER_THRESHOLD) {
              setRecommendedCafe(candidate);
              setRecommendedViewerCount(candidate.altViewer);
              setRecommendedSeatInfo(candidate.seatInfo);
              break;
            }
          }

          setRecommendOpen(true);
          setHasShownRecommend(true);
        }
      } catch (err) {
        console.warn('viewer count fetch failed:', err);
      }
    };

    fetchViewerCount();
    setHasShownRecommend(false);
  }, [data.cafeInfo.cafeId, token, allCafes, seatCongestion]);

  // 좌석 상태 polling 관리
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (!currentCafe?.cafeId || !token) return;

    const startPolling = () => {
      fetchSeatData(); // 최초 호출
      if (currentCafe.cafeId === '20') {
        console.log('Polling started!');
        intervalId = setInterval(fetchSeatData, 3000);
      }
    };

    startPolling();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Polling stopped!');
      }
    };
  }, [currentCafe?.cafeId, token]);

  return (
    <ListItem component="div">
      {currentCafe ? (
        <CafeDetailContainer>
          <CafeDetailTitleHeader
            data={currentCafe}
            seatCongestion={seatCongestion}
            token={token}
          />
          <CafePlaceInfo
            address={currentCafe.address}
            phoneNumber={currentCafe.phoneNumber}
            isCongestion={seatCongestion !== '1'}
            hasPlugCount={currentCafe.hasPlugCount}
            isCleanCount={currentCafe.isCleanCount}
            viewerCount={viewerCount}
            seatVacantCount={seatInfo.vacant}
            seatTotalCount={seatInfo.total}
            cafeId={currentCafe.cafeId}
          />
          <Box display="flex" gap={2} mt={2}>
            <Button onClick={handleClickOpen}>좌석 보기</Button>
            <Button onClick={handleCommentDialogOpen}>커뮤니티 보기</Button>
          </Box>

          {/* 좌석 보기 Dialog */}
          <Dialog
            open={open}
            onClose={handleClose}
            BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '80%',
                maxWidth: '800px',
                padding: '20px',
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h2">좌석 상세 정보</Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center' }}>
              <Box mb={2}>
                {currentCafe.cafeId === '20' ? (
                  <video
                    ref={videoRef}
                    width="100%"
                    controls
                    muted // 자동 재생 허용
                    autoPlay
                    playsInline
                    src="/videos/cafe.mp4"
                    style={{ borderRadius: '8px' }}
                  />
                ) : (
                  <img
                    src={`/images/cafe/${currentCafe.cafeId}.png`}
                    alt={`Cafe ${currentCafe.cafeId}`}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                )}
              </Box>
              <SeatList seats={seats} />
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={handleDetectFrame}
              >
                현재 프레임 추론
              </Button>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>

          {/* 추천 Dialog */}
          <Dialog
            open={recommendOpen}
            onClose={() => {
              setRecommendOpen(false);
              setHasShownRecommend(true);
            }}
            BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '70%',
                maxWidth: '600px',
                padding: '24px',
                textAlign: 'center',
              },
            }}
          >
            <DialogTitle>📢 혼잡도 안내</DialogTitle>
            <DialogContent>
              <Typography variant="body1" mb={2}>
                현재 <strong style={{ color: '#ff4d4f' }}>{viewerCount}</strong>
                명이 이 카페를 보고 있어요.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                새로운 카페도 함께 확인해보는 건 어떠세요?
              </Typography>
              {recommendedCafe ? (
                <Box mt={2}>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    👉 추천: {recommendedCafe.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    {recommendedCafe.address}
                  </Typography>
                  {recommendedViewerCount !== null && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      현재 <strong>{recommendedViewerCount}</strong>명이 보고
                      있어요.
                    </Typography>
                  )}
                  {recommendedSeatInfo && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ mt: 0.5 }}
                    >
                      🪑 좌석 상태: {recommendedSeatInfo.vacant} /{' '}
                      {recommendedSeatInfo.total}
                    </Typography>
                  )}
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={handleSelectRecommendedCafe}
                  >
                    이 카페 보러가기
                  </Button>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary" mt={2}>
                  지금은 대체 카페 추천이 어렵습니다.
                </Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={() => setRecommendOpen(false)}
              >
                닫기
              </Button>
            </DialogActions>
          </Dialog>

          {/* 댓글 Dialog */}
          <Dialog
            open={commentOpen}
            onClose={handleCommentDialogClose}
            BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
            sx={{
              '& .MuiDialog-paper': {
                backgroundColor: 'white',
                borderRadius: '8px',
                width: '80%',
                maxWidth: '800px',
                padding: '20px',
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h2">커뮤니티 댓글</Typography>
            </DialogTitle>
            <DialogContent>
              <CommunityCommentList cafeId={currentCafe.cafeId} token={token} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCommentDialogClose} color="primary">
                닫기
              </Button>
            </DialogActions>
          </Dialog>

          <ReviewList reviews={decodedReviews} />
        </CafeDetailContainer>
      ) : (
        <div>카페 상세 정보를 불러오는 중입니다...</div>
      )}
    </ListItem>
  );
};

export default CafeDetailInfo;
