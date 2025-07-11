package com.seatify.backend.api.review.controller;

import static com.seatify.backend.api.review.dto.ReviewDTO.*;

import java.net.URI;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatify.backend.domain.review.service.ReviewService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Tag(name = "cafe", description = "카페 관련 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

	private final ReviewService reviewService;


	@Tag(name = "cafe")
	@Operation(summary = "카페 리뷰 등록 API", description = "카페에 리뷰를 등록하면 커피빈을 지급하고 업데이트된 커피빈 개수를 반환하는 API 입니다.")
	@ApiResponses({
		@ApiResponse(responseCode = "R-001", description = "해당 카페에 대해 하루에 한번만 리뷰를 작성할 수 있습니다."),
		@ApiResponse(responseCode = "CR-001", description = "카페의 혼잡도는 1[LOW], 2[MEDIUM], 3[HIGH] 중 하나입니다.")
	})
	@PostMapping("/cafe/{cafeId}/review")
	public ResponseEntity<ReviewResponse> createCafeReview(@Valid @RequestBody ReviewRequest reviewRequestDTO,
		 												   @ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO,
									                       @PathVariable Long cafeId) {
		ReviewResponse reviewResponse = reviewService.createReview(reviewRequestDTO, cafeId, memberInfoDTO.getMemberId());
		return ResponseEntity.created(URI.create("/api/cafe/" + cafeId + "/review/" + reviewResponse.getReviewId()))
			.body(reviewResponse);
	}
}
