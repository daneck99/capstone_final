package com.seatify.backend.api.seat.controller;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.seat.entity.Seat;
import com.seatify.backend.domain.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/seat")
@RequiredArgsConstructor
public class SeatDummyController {

    private final SeatRepository seatRepository;
    private final CafeRepository cafeRepository;

    @PostMapping("/generate-dummy")
    public ResponseEntity<?> generateDummySeats() {
        if (seatRepository.count() > 0) {
            return ResponseEntity.ok("좌석 데이터가 이미 존재합니다. 삽입 생략.");
        }

        for (long cafeId = 1; cafeId <= 40; cafeId++) {
            Optional<Cafe> optionalCafe = cafeRepository.findById(cafeId);
            if (optionalCafe.isEmpty()) {
                System.out.println("❌ Cafe ID " + cafeId + " not found. Skipping.");
                continue;
            }

            Cafe cafe = optionalCafe.get();

            for (int i = 1; i <= 5; i++) {
                Seat seat = Seat.builder()
                        .cafe(cafe)
                        .seatNumber(i)
                        .isOccupied(ThreadLocalRandom.current().nextBoolean())
                        .x(100 * i)
                        .y(100 * i)
                        .width(50)
                        .height(50)
                        .build();

                seatRepository.save(seat);
            }
        }

        return ResponseEntity.ok("✅ 더미 좌석 데이터 삽입 완료 (카페 1~40, 각 5개)");
    }
}
