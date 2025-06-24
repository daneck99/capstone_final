import React from 'react';
import { Box, Typography } from '@mui/material';

// 좌석 정보 타입 정의
interface Seat {
  seatId: number;
  seatNumber: number;
  occupied: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  state: 'OCCUPIED' | 'EMPTY' | 'STEP_OUT';
}

interface SeatListProps {
  seats: Seat[];
}

// AI에서 넘겨준 원본 캔버스 크기 (AI에서 DS 만들 때 사용한 크기)
const AI_IMAGE_WIDTH = 1280;
const AI_IMAGE_HEIGHT = 960;

// 프론트에서 렌더링할 캔버스 크기
const FRONT_CANVAS_WIDTH = 640;
const FRONT_CANVAS_HEIGHT = 480;

const SeatList = ({ seats }: SeatListProps) => {

  // 비율 계산
  const scaleX = FRONT_CANVAS_WIDTH / AI_IMAGE_WIDTH;
  const scaleY = FRONT_CANVAS_HEIGHT / AI_IMAGE_HEIGHT;

  return (
      <Box sx={{ position: 'relative', width: FRONT_CANVAS_WIDTH, height: FRONT_CANVAS_HEIGHT, backgroundColor: '#f0f0f0' }}>
        {seats.map((seat) => {
          // 좌표 변환 적용
          const convertedX = seat.x * scaleX;
          const convertedY = seat.y * scaleY;
          const convertedWidth = seat.width * scaleX;
          const convertedHeight = seat.height * scaleY;

          return (
              <Box
                  key={seat.seatId}
                  sx={{
                    position: 'absolute',
                    left: convertedX,
                    top: convertedY,
                    width: convertedWidth,
                    height: convertedHeight,
                    backgroundColor: seat.state === 'OCCUPIED' ? 'lightcoral' : 'lightgreen',
                    border: '2px solid',
                    borderColor: seat.state === 'OCCUPIED' ? 'lightcoral' : 'lightgreen',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '4px',
                  }}
              >
                <Typography variant="h6" sx={{ fontSize: '0.8rem' }}>좌석 {seat.seatNumber}</Typography>
                <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                  {seat.state === 'OCCUPIED' || seat.state === 'STEP_OUT' ? '사용 중' : '빈 자리'}
                </Typography>
              </Box>
          );
        })}
      </Box>
  );
};

export default SeatList;
