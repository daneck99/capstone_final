package com.seatify.backend.service;

import static org.mockito.BDDMockito.*;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.domain.review.entity.Review;
import com.seatify.backend.domain.review.respository.ReviewRepository;
import com.seatify.backend.domain.review.service.ReviewService;
import com.seatify.backend.support.fixture.MemberFixture;
import com.seatify.backend.support.fixture.ReviewFixture;
import com.seatify.backend.support.utils.ServiceTest;

@ServiceTest
class ReviewServiceTest {

	@InjectMocks
	private ReviewService reviewService;

	@Mock
	private MemberService memberService;

	@Mock
	private CafeService cafeService;

	@Mock
	private ReviewRepository reviewRepository;

	@Test
	void 리뷰를_등록한다() {
		given(memberService.findMemberByMemberId(anyLong())).willReturn(MemberFixture.MEMBER);
		given(reviewRepository.save(any(Review.class))).willReturn(ReviewFixture.REVIEW);
		given(cafeService.findCafeByCafeId(anyLong())).willReturn(Cafe.builder().build());

		reviewService.createReview(ReviewFixture.REVIEW_REQUEST, 1L, 1L);

		then(reviewRepository).should(times(1)).save(any(Review.class));
	}

}
