package com.seatify.backend.api.cafeview.controller;

import com.seatify.backend.domain.cafeview.service.CafeViewService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cafe-view")
public class CafeViewController {

    private final CafeViewService cafeViewService;

    @PostMapping("/start")
    public ResponseEntity<Void> startViewing(@RequestParam String cafe_id,
                                             @MemberInfo MemberInfoDTO memberInfoDTO) {
        String userId = String.valueOf(memberInfoDTO.getMemberId());
        cafeViewService.startViewing(cafe_id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/end")
    public ResponseEntity<Void> endViewing(@RequestParam String cafe_id,
                                           @MemberInfo MemberInfoDTO memberInfoDTO) {
        String userId = String.valueOf(memberInfoDTO.getMemberId());
        cafeViewService.endViewing(cafe_id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getViewerCount(@RequestParam String cafe_id) {
        Long count = cafeViewService.getViewerCount(cafe_id);
        return ResponseEntity.ok(count);
    }
}
