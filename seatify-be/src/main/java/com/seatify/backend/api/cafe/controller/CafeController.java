package com.seatify.backend.api.cafe.controller;

import com.seatify.backend.api.cafe.dto.CafeInfoResponseDTO;
import com.seatify.backend.api.cafe.dto.CafeSaveRequestDTO;
import com.seatify.backend.api.seat.dto.SeatDTO;
import com.seatify.backend.api.seat.dto.SeatResponseDTO;
import com.seatify.backend.domain.seat.constant.SeatState;
import com.seatify.backend.domain.seat.entity.Seat;
import com.seatify.backend.domain.seat.entity.SeatStatus;
import com.seatify.backend.domain.seat.service.SeatService;
import com.seatify.backend.domain.seat.service.SeatStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seatify.backend.api.cafe.dto.CafeDTO;
import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.domain.review.service.ReviewService;
import com.seatify.backend.domain.viewedcafe.service.ViewedCafeService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Tag(name = "cafe", description = "카페 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CafeController {

	private final MemberService	memberService;
	private final CafeService cafeService;
	private final ReviewService reviewService;
	private final ViewedCafeService viewedCafeService;
	private final SeatService seatService;
	private final SeatStatusService seatStatusService;

	@Tag(name = "cafe")
	@Operation(summary = "카페 정보 저장 API", description = "구글 맵에서 수집한 카페 데이터를 저장합니다.")
	@PostMapping("/cafes")
	public ResponseEntity<Void> saveCafes(@RequestBody List<CafeSaveRequestDTO> cafeList) {
		cafeService.saveAllCafes(cafeList);
		return ResponseEntity.ok().build();
	}

	@Tag(name = "cafe")
	@Operation(summary = "카페 정보 조회 API", description = "DB에 저장된 카페 정보를 반환합니다.")
	@GetMapping("/cafes")
	public ResponseEntity<List<CafeInfoResponseDTO>> getAllCafeInfo() {
		List<CafeInfoResponseDTO> cafeList = cafeService.getAllCafeInfo();
		return ResponseEntity.ok(cafeList);
	}


	@Tag(name = "cafe")
	@Operation(summary = "카페 상세보기 API", description = "카페 정보를 조회하는 API")
	@ApiResponses({
		@ApiResponse(responseCode = "C-001", description = "해당 카페는 존재하지 않습니다.")
	})
	@GetMapping("/cafe/{cafeId}")
	public ResponseEntity<CafeDTO> cafeInfo(@PathVariable Long cafeId,
										    @ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO) {
		return ResponseEntity.ok(cafeService.findCafeInfoById(memberInfoDTO.getMemberId(), cafeId));
	}

	@Tag(name = "cafe")
	@ApiResponses({
		@ApiResponse(responseCode = "C-001", description = "해당 카페는 존재하지 않습니다.")
	})
	@PostMapping("/cafe/{cafeId}")
	public ResponseEntity<CafeDTO> cafeCongestionCheck(@PathVariable Long cafeId,
		                                               @ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO) {
		final Long memberId = memberInfoDTO.getMemberId();
		reviewService.validateReviewExists(cafeId);
		viewedCafeService.validateCongestionRequest(memberId, cafeId);
		viewedCafeService.addViewedCafe(memberService.findMemberByMemberId(memberId), cafeId);
		return ResponseEntity.ok(cafeService.findCafeInfoById(memberId, cafeId));
	}

	@GetMapping("/cafe/{cafeId}/seats")
	public List<SeatResponseDTO> getSeats(@PathVariable Long cafeId) {
		List<Seat> seats = seatService.findSeatsByCafeId(cafeId);

		// 좌석 상태 정보도 함께 가져오기
		List<SeatStatus> seatStatuses = seatStatusService.findStatusByCafeId(cafeId);

		// seatNumber 기준으로 상태를 매핑
		Map<Integer, SeatState> statusMap = seatStatuses.stream()
				.collect(Collectors.toMap(SeatStatus::getSeatNumber, SeatStatus::getState));

		return seats.stream()
				.map(seat -> new SeatResponseDTO(
						seat.getSeatId(),
						seat.getSeatNumber(),
						seat.isOccupied(),
						seat.getX(),
						seat.getY(),
						seat.getWidth(),
						seat.getHeight(),
						statusMap.getOrDefault(seat.getSeatNumber(), SeatState.EMPTY).name() // ✅ 수정됨
				))
				.collect(Collectors.toList());
	}

	@Tag(name = "cafe")
	@Operation(summary = "카페 좌석 상태 업데이트 API", description = "YOLO 결과를 반영하여 좌석 상태를 업데이트하는 API")
	@PostMapping("/cafe/{cafeId}/seats/update")
	public ResponseEntity<Void> updateSeats(@PathVariable Long cafeId, @RequestBody List<SeatDTO> seats) {
		seatService.updateSeats(cafeId, seats);
		return ResponseEntity.ok().build();
	}

}
