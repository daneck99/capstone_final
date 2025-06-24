package com.seatify.backend.api.home.controller;

import com.seatify.backend.api.cafe.dto.CafeInfoResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

@Tag(name = "home", description = "홈 화면 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class HomeController {

	private final CafeService cafeService;

	@Tag(name = "home")
	@Operation(summary = "홈 화면 API", description = "홈 화면에 필요한 모든 카페 정보를 반환하는 API 입니다.")
	@GetMapping("/home")
	public ResponseEntity<List<CafeInfoResponseDTO>> home(@ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO) {
		// 모든 카페 정보를 반환
		List<CafeInfoResponseDTO> allCafeInfo = cafeService.getAllCafeInfo();
		return ResponseEntity.ok(allCafeInfo);
	}
}
