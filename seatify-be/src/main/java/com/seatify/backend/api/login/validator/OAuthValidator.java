package com.seatify.backend.api.login.validator;

import com.seatify.backend.domain.member.constant.MemberType;
import com.seatify.backend.global.error.ErrorCode;
import com.seatify.backend.global.error.exception.BusinessException;

public class OAuthValidator {

	public static void validateMemberType(String memberType) {
		if (!MemberType.isMemberType(memberType)) {
			throw new BusinessException(ErrorCode.INVALID_MEMBER_TYPE);
		}
	}
}
