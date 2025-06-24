package com.seatify.backend.api.token.service;

import java.util.Date;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.api.token.dto.AccessTokenResponseDTO;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.jwt.constant.GrantType;
import com.seatify.backend.global.jwt.service.TokenManager;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TokenService {

	private final MemberService memberService;
	private final TokenManager tokenManager;

	public AccessTokenResponseDTO createAccessTokenByRefreshToken(final String refreshToken) {
		Member member = memberService.findMemberByRefreshToken(refreshToken);
		Date accessTokenExpireTime = tokenManager.createAccessTokenExpireTime();
		String accessToken = tokenManager.createAccessToken(member.getMemberId(), member.getRole(),
			accessTokenExpireTime);

		return AccessTokenResponseDTO.builder()
			.grantType(GrantType.BEARER.getType())
			.accessToken(accessToken)
			.accessTokenExpireTime(accessTokenExpireTime)
			.build();
	}
}
