package com.seatify.backend.global.jwt.constant;

import lombok.Getter;

@Getter
public enum GrantType {

	BEARER("Bearer");

	GrantType(final String type) {
		this.type = type;
	}

	private String type;
}
