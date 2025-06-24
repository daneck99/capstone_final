package com.seatify.backend.support.fixture;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.seatify.backend.api.cafe.dto.CafeDTO;
import com.seatify.backend.api.cafe.dto.CafeInfoResponseDTO;
import com.seatify.backend.api.comment.dto.CommentInfoDTO;
import com.seatify.backend.api.member.dto.CafeInfoViewedByMemberProjection;

import static org.mockito.Mockito.*;

public class CafeFixture {

	public static final CafeInfoResponseDTO CAFE_INFO_RESPONSE_DTO = createCafeInfoResponseDTO();
	public static final CafeDTO CAFE_INFO_DTO = createCafeInfoDTO();
	public static final CafeInfoViewedByMemberProjection CAFE_INFO_VIEWED_BY_MEMBER = mock(CafeInfoViewedByMemberProjection.class);
	public static final List<Long> VIEWED_CAFE_IDS = new ArrayList<>(List.of(1L, 2L, 3L));

	private static CafeDTO createCafeInfoDTO() {
		return CafeDTO.builder()
				.cafeInfo(CAFE_INFO_RESPONSE_DTO)
				.comments(Collections.<CommentInfoDTO>emptyList())
				.build();
	}

	private static CafeInfoResponseDTO createCafeInfoResponseDTO() {
		return CafeInfoResponseDTO.builder()
				.cafeId("1")
				.name("5to7")
				.phoneNumber("050713337616")
				.address("서울시 성동구 서울숲2길44-13 1층")
				.status("영업중")
				.hasPlugCount(5)
				.isCleanCount(5)
				.rating("4.3")
				.latitude("37.5460707")
				.longitude("127.043297")
				.build();
	}
}
