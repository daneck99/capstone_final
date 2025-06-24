package com.seatify.backend.domain.member.constant;

public enum Role {
	USER,
	ADMIN,
	MANAGER;   // ✅ 사장님 역할 추가

	public static Role from(final String role) {
		return Role.valueOf(role);
	}
}
