package com.seatify.backend.external.oauth.service;

import com.seatify.backend.external.oauth.model.OAuthAttributes;

public interface SocialLoginApiService {

	OAuthAttributes getUserInfo(String accessToken);
}
