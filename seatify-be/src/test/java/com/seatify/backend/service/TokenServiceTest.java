package com.seatify.backend.service;

import static com.seatify.backend.support.fixture.LoginFixture.*;
import static com.seatify.backend.support.fixture.MemberFixture.*;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.seatify.backend.api.token.dto.AccessTokenResponseDTO;
import com.seatify.backend.api.token.service.TokenService;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.jwt.service.TokenManager;
import com.seatify.backend.support.utils.ServiceTest;

@ServiceTest
class TokenServiceTest {

	@InjectMocks
	private TokenService tokenService;

	@Mock
	private MemberService memberService;

	@Mock
	private TokenManager tokenManager;

	@Test
	void access_Token_재발급을_테스트한다() {
		given(memberService.findMemberByRefreshToken(anyString())).willReturn(MEMBER);
		given(tokenManager.createAccessTokenExpireTime()).willReturn(
			new Date(System.currentTimeMillis() + Long.parseLong("900000"))
		);
		given(tokenManager.createAccessToken(anyLong(), any(), any(Date.class))).willReturn(ACCESS_TOKEN);

		AccessTokenResponseDTO accessTokenResponseDTO = tokenService
			.createAccessTokenByRefreshToken(MEMBER.getRefreshToken());

		then(tokenManager).should(times(1)).createAccessToken(anyLong(), any(), any(Date.class));

		assertThat(accessTokenResponseDTO.getAccessToken()).isNotNull();
		assertThat(accessTokenResponseDTO.getAccessTokenExpireTime()).isAfter(new Date(System.currentTimeMillis()));
	}
}
