package com.seatify.backend.domain.seat.service;

public interface SeatLayoutService {

    /**
     * 지정된 카페에 대한 좌석 레이아웃 정보를 JSON으로 받아 저장합니다.
     *
     * @param cafeId   카페 ID
     * @param jsonData 좌석 레이아웃 정보가 담긴 JSON 문자열
     */
    void saveSeatLayoutFromJson(Long cafeId, String jsonData);
}
