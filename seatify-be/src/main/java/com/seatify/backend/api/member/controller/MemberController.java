package com.seatify.backend.api.member.controller;

import javax.validation.Valid;

import com.seatify.backend.api.member.dto.ManagedCafeUpdateRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.seatify.backend.api.member.dto.MemberInfoResponseDTO;
import com.seatify.backend.api.member.dto.MyPageDTO;
import com.seatify.backend.api.member.service.MemberInfoService;
import com.seatify.backend.api.member.service.MyPageService;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Tag(name = "member", description = "회원 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

	private final MemberService memberService;
	private final MemberInfoService memberInfoService;
	private final MyPageService myPageService;

	@Tag(name = "member")
	@Operation(summary = "회원 정보 조회 API", description = "회원 정보 조회 API")
	@ApiResponses({
		@ApiResponse(responseCode = "A-001", description = "토큰이 만료되었습니다."),
		@ApiResponse(responseCode = "A-002", description = "해당 토큰은 유효한 토큰이 아닙니다."),
		@ApiResponse(responseCode = "M-003", description = "해당 회원은 존재하지 않습니다.")
	})
	@GetMapping("/info")
	public ResponseEntity<MemberInfoResponseDTO> getMemberInfo(@ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO) {
		Long memberId = memberInfoDTO.getMemberId();
		MemberInfoResponseDTO memberInfoResponseDTO = memberInfoService.getMemberInfo(memberId);
		return ResponseEntity.ok(memberInfoResponseDTO);
	}

	@Tag(name = "member")
	@Operation(summary = "마이페이지 조회 API", description = "마이페이지 조회 API")
	@ApiResponses({
		@ApiResponse(responseCode = "A-001", description = "토큰이 만료되었습니다."),
		@ApiResponse(responseCode = "A-002", description = "해당 토큰은 유효한 토큰이 아닙니다."),
		@ApiResponse(responseCode = "M-003", description = "해당 회원은 존재하지 않습니다.")
	})
	@GetMapping("/mypage")
	public ResponseEntity<MyPageDTO> getMyPage(@ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO) {
		return ResponseEntity.ok(myPageService.getMyPageDTO(memberInfoDTO.getMemberId()));
	}

	@Tag(name = "member")
	@Operation(summary = "회원이 관리할 카페 등록 API", description = "사장님이 관리할 카페 선택 시 호출됩니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "A-001", description = "토큰이 만료되었습니다."),
			@ApiResponse(responseCode = "A-002", description = "해당 토큰은 유효한 토큰이 아닙니다."),
			@ApiResponse(responseCode = "M-003", description = "해당 회원은 존재하지 않습니다.")
	})

	@PatchMapping("/managed-cafe")
	public ResponseEntity<String> updateManagedCafe(@ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO,
													@Valid @RequestBody ManagedCafeUpdateRequestDTO requestDTO) {
		memberService.updateManagedCafe(memberInfoDTO.getMemberId(), requestDTO.getManagedCafeId());
		return ResponseEntity.ok("Managed cafe updated successfully");
	}

}
