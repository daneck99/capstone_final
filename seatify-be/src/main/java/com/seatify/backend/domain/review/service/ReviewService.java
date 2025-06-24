package com.seatify.backend.domain.review.service;

import static com.seatify.backend.api.review.dto.ReviewDTO.*;

import com.seatify.backend.domain.cafe.entity.Cafe;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.domain.review.constant.CafeCongestion;
import com.seatify.backend.domain.review.entity.Review;
import com.seatify.backend.domain.review.respository.ReviewRepository;
import com.seatify.backend.global.error.ErrorCode;
import com.seatify.backend.global.error.exception.BusinessException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final MemberService memberService;
	private final CafeService cafeService;

	public ReviewResponse createReview(final ReviewRequest reviewRequestDTO, final Long cafeId, final Long memberId) {
		Member member = memberService.findMemberByMemberId(memberId);
		Review review = reviewRepository.save(createReviewFromDTO(reviewRequestDTO, cafeId, member));
		Cafe cafe = cafeService.findCafeByCafeId(cafeId);

		// Plug와 Clean이 true일 경우 카운트 증가
		if (Boolean.parseBoolean(reviewRequestDTO.getHasPlug())) {
			cafe.setHasPlugCount(cafe.getHasPlugCount() + 1);
		}
		if (Boolean.parseBoolean(reviewRequestDTO.getIsClean())) {
			cafe.setIsCleanCount(cafe.getIsCleanCount() + 1);
		}

		// 카페 정보 업데이트
		cafeService.saveCafe(cafe);

		return ReviewResponse.builder()
				.reviewId(review.getReviewId())
				.coffeeBean(member.getCoffeeBean())
				.build();
	}

	private Review createReviewFromDTO(final ReviewRequest reviewRequestDTO, final Long cafeId, final Member member) {
		return Review.builder()
			.cafe(cafeService.findCafeByCafeId(cafeId))
			.cafeCongestion(CafeCongestion.from(reviewRequestDTO.getCafeCongestion()))
			.isClean(Boolean.parseBoolean(reviewRequestDTO.getIsClean()))
			.hasPlug(Boolean.parseBoolean(reviewRequestDTO.getHasPlug()))
			.member(member)
			.build();
	}

	@Transactional(readOnly = true)
	public void validateReviewExists(final Long cafeId) {
		log.info("hasReviewed = {}", reviewRepository.existsReviewByCafeId(cafeId));
		if (!reviewRepository.existsReviewByCafeId(cafeId)) {
			throw new BusinessException(ErrorCode.REVIEW_NOT_FOUND);
		}
	}
}
