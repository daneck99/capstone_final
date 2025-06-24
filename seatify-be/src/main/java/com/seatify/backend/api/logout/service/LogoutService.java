package com.seatify.backend.api.logout.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.error.ErrorCode;
import com.seatify.backend.global.error.exception.AuthenticationException;
import com.seatify.backend.global.jwt.constant.TokenType;
import com.seatify.backend.global.jwt.service.TokenManager;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LogoutService {

	private final MemberService memberService;
	private final TokenManager tokenManager;

	public void logout(String accessToken) {
		//토큰 검증
		tokenManager.validateToken(accessToken);

		//토큰 타입 확인
		Claims tokenClaims = tokenManager.getTokenClaims(accessToken);
		String tokenType = tokenClaims.getSubject();
		if (!TokenType.isAccessToken(tokenType)) {
			throw new AuthenticationException(ErrorCode.NOT_ACCESS_TOKEN_TYPE);
		}

		//refresh token 만료 처리
		Long memberId = Long.valueOf((Integer)tokenClaims.get("memberId"));
		Member member = memberService.findMemberByMemberId(memberId);
		member.expireRefreshToken(LocalDateTime.now());
	}
}
