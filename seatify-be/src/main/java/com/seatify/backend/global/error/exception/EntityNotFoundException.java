package com.seatify.backend.global.error.exception;

import com.seatify.backend.global.error.ErrorCode;

public class EntityNotFoundException extends BusinessException {

	public EntityNotFoundException(ErrorCode errorCode) {
		super(errorCode);
	}
}
