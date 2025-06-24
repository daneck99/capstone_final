package com.seatify.backend.api.congestion.controller;

import com.seatify.backend.api.congestion.dto.HourlyCongestionDTO;
import com.seatify.backend.domain.congestion.service.CongestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "congestion", description = "혼잡도 예측 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/congestion")
public class CongestionController {

    private final CongestionService congestionService;

    @Operation(summary = "카페 시간대별 혼잡도 예측", description = "CSV 기반으로 혼잡도 예측 정보를 반환합니다.")
    @GetMapping("/cafe/{cafeId}")
    public ResponseEntity<List<HourlyCongestionDTO>> getCongestionByCafe(
            @PathVariable Long cafeId,
            @RequestParam String day
    ) {
        List<HourlyCongestionDTO> predictions = congestionService.getPredictionsFromCsv(cafeId, day);
        return ResponseEntity.ok(predictions);
    }
}
