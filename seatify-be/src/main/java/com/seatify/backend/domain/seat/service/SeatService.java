package com.seatify.backend.domain.seat.service;

import com.seatify.backend.api.seat.dto.SeatDTO;
import com.seatify.backend.api.seat.dto.SeatResponseDTO;
import com.seatify.backend.domain.seat.constant.SeatState;
import com.seatify.backend.domain.seat.entity.SeatStatus;
import org.springframework.stereotype.Service;

import com.seatify.backend.domain.seat.entity.Seat;
import com.seatify.backend.domain.seat.repository.SeatRepository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final SeatStatusService seatStatusService;

    public SeatService(SeatRepository seatRepository, SeatStatusService seatStatusService) {
        this.seatRepository = seatRepository;
        this.seatStatusService = seatStatusService;
    }

    // 카페의 좌석 정보를 반환하는 메소드
    public List<Seat> findSeatsByCafeId(Long cafeId) {
        return seatRepository.findByCafe_CafeId(cafeId); // 카페 ID에 해당하는 좌석 정보 반환
    }

    @Transactional
    public void updateSeats(Long cafeId, List<SeatDTO> seats) {
        for (SeatDTO dto : seats) {
            Seat seat = seatRepository.findById(dto.getSeatID())
                    .orElseThrow(() -> new IllegalArgumentException("Seat not found with ID: " + dto.getSeatID()));

            // 상태(state) 기준으로 occupied 필드 업데이트
            seat.setIsOccupied("using_table".equals(dto.getState()));

            // 원하면 좌표값 등도 업데이트 가능
            seat.setX(dto.getX());
            seat.setY(dto.getY());
            seat.setWidth(dto.getWidth());
            seat.setHeight(dto.getHeight());

            seatRepository.save(seat);
        }
    }

    public List<SeatResponseDTO> findSeatsWithStatusByCafeId(Long cafeId) {
        List<Seat> seats = seatRepository.findByCafe_CafeId(cafeId);
        List<SeatStatus> statuses = seatStatusService.findStatusByCafeId(cafeId);

        // seatNumber 기준으로 상태 매핑
        Map<Integer, SeatState> statusMap = statuses.stream()
                .collect(Collectors.toMap(
                        SeatStatus::getSeatNumber,
                        SeatStatus::getState,
                        (existing, replacement) -> replacement  // 중복 처리
                ));

        return seats.stream()
                .map(seat -> new SeatResponseDTO(
                        seat.getSeatId(),
                        seat.getSeatNumber(),
                        seat.isOccupied(),
                        seat.getX(),
                        seat.getY(),
                        seat.getWidth(),
                        seat.getHeight(),
                        statusMap.getOrDefault(seat.getSeatNumber(), SeatState.EMPTY).name()
                ))
                .collect(Collectors.toList());
    }

}
