package com.seatify.backend.service;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.support.utils.ServiceTest;

@ServiceTest
class CafeServiceTest {

	@InjectMocks
	private CafeService cafeService;

	@Mock
	private CafeRepository cafeRepository;

}
