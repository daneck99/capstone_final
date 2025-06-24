package com.seatify.backend.api;

import static com.seatify.backend.support.fixture.MemberFixture.*;
import static org.mockito.BDDMockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;

import com.seatify.backend.api.member.controller.MemberController;
import com.seatify.backend.api.member.dto.MyPageDTO;

class MemberControllerTest extends ControllerTestSupporter {

	@Test
	void 회원_정보를_가져온다() throws Exception {
		given(memberInfoService.getMemberInfo(anyLong()))
			.willReturn(MEMBER_INFO_RESPONSE_DTO);

		mockMvc(new MemberController(memberService, memberInfoService, myPageService))
			.perform(get("/api/member/info"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.memberName").value("홍길동"))
			.andExpect(jsonPath("$.email").value("test@test.com"));
	}

	@Test
	void 마이페이지에_사용하는_회원_정보를_반환한다() throws Exception {
		MyPageDTO response = MyPageDTO.builder()
			.reviewCount(5L)
			.build();

		given(myPageService.getMyPageDTO(anyLong())).willReturn(response);

		mockMvc(new MemberController(memberService, memberInfoService, myPageService))
			.perform(get("/api/member/mypage"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.reviewCount").value(5L));
	}

}
