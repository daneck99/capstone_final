package com.seatify.backend.web.kakaotoken.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.cloud.openfeign.SpringQueryMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.seatify.backend.web.kakaotoken.dto.KakaoTokenDTO;

@FeignClient(url = "https://kauth.kakao.com", name = "kakaoTokenClient")
public interface KakaoTokenClient {

	@PostMapping(value = "/oauth/token", consumes = "application/json")
	KakaoTokenDTO.Response requestKakaoToken(@RequestHeader("Content-Type") String contentType,
											 @SpringQueryMap KakaoTokenDTO.Request request);
}
