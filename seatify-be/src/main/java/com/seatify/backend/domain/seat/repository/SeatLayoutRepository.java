package com.seatify.backend.domain.seat.repository;

import com.seatify.backend.domain.seat.entity.SeatLayout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatLayoutRepository extends JpaRepository<SeatLayout, Long> {

    // 특정 카페에 속한 모든 좌석 배치 정보 조회
    List<SeatLayout> findByCafe_CafeId(Long cafeId);

    // 필요시 seatNumber로도 조회 가능
    SeatLayout findByCafe_CafeIdAndSeatNumber(Long cafeId, int seatNumber);

    void deleteByCafe_CafeId(Long cafeId);
}