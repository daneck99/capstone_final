package com.seatify.backend.global.config;

import javax.annotation.PostConstruct;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.comment.repository.CommentRepository;
import com.seatify.backend.domain.member.constant.MemberType;
import com.seatify.backend.domain.member.constant.Role;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.repository.MemberRepository;
import com.seatify.backend.domain.review.respository.ReviewRepository;
import com.seatify.backend.domain.viewedcafe.entity.ViewedCafe;
import com.seatify.backend.domain.viewedcafe.repository.ViewedCafeRepository;
import com.seatify.backend.global.jwt.dto.JwtTokenDTO;
import com.seatify.backend.global.jwt.service.TokenManager;

import lombok.RequiredArgsConstructor;

@Profile({"dev", "prod", "test"})
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "spring.jpa.hibernate.ddl-auto", havingValue = "create")
public class DatabaseInitializer {

	private final InitService initService;

	@PostConstruct
	public void init() {
		initService.dbInit();
	}

	@Component
	@Transactional
	@RequiredArgsConstructor
	static class InitService {

		private final CafeRepository cafeRepository;
		private final ReviewRepository reviewRepository;
		private final CommentRepository commentRepository;
		private final MemberRepository memberRepository;
		private final ViewedCafeRepository viewedCafeRepository;
		private final TokenManager tokenManager;

		public void dbInit() {
			// Sample 회원 추가

			Member member1 = memberRepository.save(
				Member.builder()
					.memberType(MemberType.KAKAO)
					.email("testuser1@email.com")
					.name("장원준")
					.role(Role.USER)
					.coffeeBean(100)
					.build()
			);

			final JwtTokenDTO jwtTokenDto = tokenManager.createJwtTokenDto(member1.getMemberId(), member1.getRole());
			System.out.println(jwtTokenDto.getAccessToken() + " member1 jwtTokenDto access_token");
			member1.updateRefreshToken(jwtTokenDto);

			Member member2 = memberRepository.save(
				Member.builder()
					.memberType(MemberType.KAKAO)
					.email("testuser2@email.com")
					.name("황의찬")
					.role(Role.USER)
					.coffeeBean(100)
					.build()
			);

			Member member3 = memberRepository.save(
				Member.builder()
					.memberType(MemberType.KAKAO)
					.email("testuser3@email.com")
					.name("유성민")
					.role(Role.USER)
					.coffeeBean(100)
					.build()
			);

			Member member4 = memberRepository.save(
				Member.builder()
					.memberType(MemberType.KAKAO)
					.email("testuser4@email.com")
					.name("강신혁")
					.role(Role.USER)
					.coffeeBean(100)
					.build()
			);

			Member member5 = memberRepository.save(
				Member.builder()
					.memberType(MemberType.KAKAO)
					.email("testuser5@email.com")
					.name("이동훈")
					.role(Role.USER)
					.coffeeBean(100)
					.build()
			);

			viewedCafeRepository.save(
				ViewedCafe.builder()
					.cafeId(1L)
					.member(member1)
					.build()
			);

			viewedCafeRepository.save(
				ViewedCafe.builder()
					.cafeId(2L)
					.member(member1)
					.build()
			);

			viewedCafeRepository.save(
				ViewedCafe.builder()
					.cafeId(3L)
					.member(member1)
					.build()
			);

		}
	}
}
