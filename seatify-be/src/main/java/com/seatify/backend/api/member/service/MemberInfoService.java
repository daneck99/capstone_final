package com.seatify.backend.api.member.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.api.member.dto.MemberInfoResponseDTO;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.domain.viewedcafe.service.ViewedCafeService;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberInfoService {

	private final MemberService memberService;
	private final ViewedCafeService viewedCafeService;

	@Transactional(readOnly = true)
	public MemberInfoResponseDTO getMemberInfo(final Long memberId) {
		Member member = memberService.findMemberByMemberId(memberId);
		List<Long> viewedCafeIds = viewedCafeService.findViewedCafes(memberId);
		return MemberInfoResponseDTO.of(member, viewedCafeIds);
	}
}
