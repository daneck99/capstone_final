package com.seatify.backend.external.oauth.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.seatify.backend.domain.member.constant.MemberType;

@Service
public class SocialLoginApiServiceFactory {

	private static Map<String, SocialLoginApiService> socialLoginApiServices;

	public SocialLoginApiServiceFactory(Map<String, SocialLoginApiService> socialLoginApiServices) {
		this.socialLoginApiServices = socialLoginApiServices;
	}

	public static SocialLoginApiService getSocialLoginApiService(MemberType memberType) {
		String socialLoginApiServiceBeanName = "";

		if (MemberType.KAKAO == memberType) {
			socialLoginApiServiceBeanName = "kakaoLoginApiServiceImpl";
		} else if (MemberType.GOOGLE == memberType) {
			socialLoginApiServiceBeanName = "googleLoginApiServiceImpl";
		}
		return socialLoginApiServices.get(socialLoginApiServiceBeanName);
	}
}
