package com.seatify.backend.global.error.exception;

import com.seatify.backend.global.error.ErrorCode;

public class AuthenticationException extends BusinessException {

	public AuthenticationException(ErrorCode errorCode) {
		super(errorCode);
	}
}
