package com.seatify.backend.domain.seat.service;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.seat.constant.SeatState;
import com.seatify.backend.domain.seat.entity.Seat;
import com.seatify.backend.domain.seat.entity.SeatStatus;
import com.seatify.backend.domain.seat.repository.SeatRepository;
import com.seatify.backend.domain.seat.repository.SeatStatusRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SeatStatusServiceImpl implements SeatStatusService {

    private final SeatStatusRepository seatStatusRepository;
    private final CafeRepository cafeRepository;
    private final SeatRepository seatRepository;

    @Override
    @Transactional
    public void updateSeatStatusFromJson(Long cafeId, String jsonString) {
        JSONArray stats = new JSONArray(jsonString);

        Cafe cafe = cafeRepository.findById(cafeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카페가 존재하지 않습니다: " + cafeId));

        for (int i = 0; i < stats.length(); i++) {
            JSONObject obj = stats.getJSONObject(i);

            int seatID = obj.getInt("seatID");
            String stateStr = obj.getString("state");
            SeatState state = SeatState.valueOf(stateStr);

            SeatStatus status = SeatStatus.builder()
                    .cafe(cafe)
                    .seatNumber(seatID)
                    .state(state)
                    .build();

            seatStatusRepository.save(status);

            Seat seat = seatRepository.findByCafe_CafeIdAndSeatNumber(cafeId, seatID).orElse(null);
            if (seat != null) {
                seat.setIsOccupied(state == SeatState.OCCUPIED ||
                        state == SeatState.STEP_OUT ||
                        state == SeatState.LONG_STEP_OUT);
                seatRepository.save(seat);
            }

            System.out.println(String.format(
                    "[DEBUG] 카페 ID: %d | 좌석 번호: %d → 상태: %s",
                    cafeId, seatID, state.name()
            ));
        }
    }

    @Override
    @Transactional
    public void updateSeatStatusFromList(Long cafeId, List<Map<String, Object>> statusList) {
        Cafe cafe = cafeRepository.findById(cafeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카페가 존재하지 않습니다: " + cafeId));

        for (Map<String, Object> status : statusList) {
            Integer seatID = (Integer) status.get("seatID");
            Integer stateInt = (Integer) status.get("state");

            SeatState seatState = SeatState.fromCode(stateInt);

            // ✅ seatStatus 업데이트
            SeatStatus existing = seatStatusRepository.findByCafe_CafeIdAndSeatNumber(cafeId, seatID);
            if (existing != null) {
                existing.setState(seatState);
            } else {
                SeatStatus seatStatus = SeatStatus.builder()
                        .cafe(cafe)
                        .seatNumber(seatID)
                        .state(seatState)
                        .build();
                seatStatusRepository.save(seatStatus);
            }

            // ✅ Seat의 isOccupied 필드 동기화
            Seat seat = seatRepository.findByCafe_CafeIdAndSeatNumber(cafeId, seatID).orElse(null);
            if (seat != null) {
                seat.setIsOccupied(seatState == SeatState.OCCUPIED ||
                        seatState == SeatState.STEP_OUT ||
                        seatState == SeatState.LONG_STEP_OUT);
            }
        }
    }

    @Override
    public List<SeatStatus> findStatusByCafeId(Long cafeId) {
        return seatStatusRepository.findByCafe_CafeId(cafeId);
    }

}