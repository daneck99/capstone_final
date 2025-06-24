package com.seatify.backend.domain.seat.service;

import java.util.List;
import java.util.Map;

import com.seatify.backend.domain.seat.entity.SeatStatus;

public interface SeatStatusService {

    void updateSeatStatusFromJson(Long cafeId, String jsonData);

    void updateSeatStatusFromList(Long cafeId, List<Map<String, Object>> statusList);

    // ✅ 좌석 상태 목록 조회용 메서드 추가
    List<SeatStatus> findStatusByCafeId(Long cafeId);
}
