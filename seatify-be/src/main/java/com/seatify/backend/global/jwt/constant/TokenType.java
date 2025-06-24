package com.seatify.backend.global.jwt.constant;

public enum TokenType {

	ACCESS, REFRESH;

	public static boolean isAccessToken(final String tokenType) {
		return TokenType.ACCESS.name().equals(tokenType);
	}
}
