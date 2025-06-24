package com.seatify.backend.service;

import static com.seatify.backend.support.fixture.LoginFixture.*;
import static org.mockito.BDDMockito.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;

import com.seatify.backend.api.logout.service.LogoutService;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.jwt.service.TokenManager;
import com.seatify.backend.support.utils.ServiceTest;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.any;

import io.jsonwebtoken.Claims;

@ServiceTest
class LogoutServiceTest {

	@InjectMocks
	private LogoutService logoutService;

	@Mock
	private MemberService memberService;

	@Mock
	private TokenManager tokenManager;

	@Spy
	private Member member;

	@Mock
	private Claims tokenClaims;

	@Test
	void 로그아웃을_하면_refresh_token을_만료처리한다() {
		stubTokenManager();
		given(memberService.findMemberByMemberId(1L)).willReturn(member);

		logoutService.logout(ACCESS_TOKEN);

		verify(member, times(1)).expireRefreshToken(any(LocalDateTime.class));
	}

	private void stubTokenManager() {
		given(tokenManager.getTokenClaims(ACCESS_TOKEN)).willReturn(tokenClaims);
		given(tokenClaims.getSubject()).willReturn(ACCESS);
		given(tokenClaims.get("memberId")).willReturn(1);
	}
}