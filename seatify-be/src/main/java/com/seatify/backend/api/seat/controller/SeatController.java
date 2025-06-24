package com.seatify.backend.api.seat.controller;

import com.seatify.backend.domain.seat.service.SeatLayoutService;
import com.seatify.backend.domain.seat.service.SeatStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seat")
@RequiredArgsConstructor
public class SeatController {

    private final SeatLayoutService seatLayoutService;
    private final SeatStatusService seatStatusService;

    // 좌석 배치 정보 수신
    @PostMapping("/{cafeId}/layout")
    public ResponseEntity<String> receiveSeatLayout(@PathVariable Long cafeId, @RequestBody Map<String, Object> payload) {
        try {
            String jsonData = (String) payload.get("data");  // JSON string
            seatLayoutService.saveSeatLayoutFromJson(cafeId, jsonData);
            return ResponseEntity.ok("{\"message\": \"Seat layout saved successfully.\"}");
        } catch (Exception e) {
            e.printStackTrace();  // 반드시 로그 출력
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to store seat layout.\"}");
        }
    }

    // 좌석 상태 정보 수신
    @PostMapping("/{cafeId}/status")
    public ResponseEntity<String> receiveSeatStatus(@PathVariable Long cafeId, @RequestBody Map<String, Object> payload) {
        try {
            System.out.println("=== [AI 좌석 상태 수신] ===");
            System.out.println("cafe_id (from path): " + cafeId);

            // status_list 추출
            List<Map<String, Object>> statusList = (List<Map<String, Object>>) payload.get("status_list");

            for (Map<String, Object> status : statusList) {
                Integer seatID = (Integer) status.get("seatID");
                Integer state = (Integer) status.get("state");
                System.out.println("seatID: " + seatID + ", state: " + state);
            }
            System.out.println("===========================");

            // 예시: 서비스 계층으로 넘겨 처리 (필요하면 json 변환 생략하고 객체 직접 전달)
            seatStatusService.updateSeatStatusFromList(cafeId, statusList);

            return ResponseEntity.ok("{\"message\": \"Seat status updated successfully.\"}");
        } catch (Exception e) {
            e.printStackTrace(); // 로그 출력
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to store seat status.\"}");
        }
    }

}