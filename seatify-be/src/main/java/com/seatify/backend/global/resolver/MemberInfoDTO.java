package com.seatify.backend.global.resolver;

import com.seatify.backend.domain.member.constant.Role;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class MemberInfoDTO {

	private Long memberId;
	private Role role;
}
