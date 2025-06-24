package com.seatify.backend.api.login.service;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.api.login.dto.OAuthLoginDTO;
import com.seatify.backend.domain.member.constant.MemberType;
import com.seatify.backend.domain.member.constant.Role;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.external.oauth.model.OAuthAttributes;
import com.seatify.backend.external.oauth.service.SocialLoginApiService;
import com.seatify.backend.external.oauth.service.SocialLoginApiServiceFactory;
import com.seatify.backend.global.jwt.dto.JwtTokenDTO;
import com.seatify.backend.global.jwt.service.TokenManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class OAuthLoginService {

	private final MemberService memberService;
	private final TokenManager tokenManager;

	public OAuthLoginDTO.OAuthLoginResponse oauthLogin(String accessToken, MemberType memberType) {
		SocialLoginApiService socialLoginApiService = SocialLoginApiServiceFactory.getSocialLoginApiService(memberType);
		OAuthAttributes userInfo = socialLoginApiService.getUserInfo(accessToken);
		log.info("userInfo : {}", userInfo);

		JwtTokenDTO jwtTokenDTO;
		Member oauthMember;

		Optional<Member> optionalMember = memberService.findMemberByEmailAndMemberType(userInfo.getEmail(), userInfo.getMemberType());
		if (optionalMember.isEmpty()) {		//신규 회원가입
			oauthMember = userInfo.toMemberEntity(memberType, Role.USER);
			oauthMember = memberService.registerMember(oauthMember);
		} else {	//기존 회원
			oauthMember = optionalMember.get();
		}

		// 토큰 생성
		jwtTokenDTO = tokenManager.createJwtTokenDto(oauthMember.getMemberId(), oauthMember.getRole());
		oauthMember.updateRefreshToken(jwtTokenDTO);

		// ⭐ 여기서 managedCafeId 포함해서 반환
		return OAuthLoginDTO.OAuthLoginResponse.of(jwtTokenDTO, oauthMember.getManagedCafeId());
	}
}