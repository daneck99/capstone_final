package com.seatify.backend.domain.seat.repository;

import com.seatify.backend.domain.seat.entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatStatusRepository extends JpaRepository<SeatStatus, Long> {

    // 특정 카페의 모든 좌석 상태 조회
    List<SeatStatus> findByCafe_CafeId(Long cafeId);

    // 특정 카페 + 특정 좌석번호에 해당하는 좌석 상태 조회
    SeatStatus findByCafe_CafeIdAndSeatNumber(Long cafeId, int seatNumber);
}