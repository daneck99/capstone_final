package com.seatify.backend.api.congestion.dto;

import com.seatify.backend.domain.seat.constant.SeatState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HourlyCongestionDTO {
    private int hour;             // 시간대 (예: 10)
    private int percentage;       // 점유율 퍼센트 (예: 65)
    private String status;        // "SPARE" | "AVERAGE" | "BUSY"
    private boolean isCurrent;    // 현재 시간대 여부
    private boolean isPast;       // 과거 시간대 여부
}
