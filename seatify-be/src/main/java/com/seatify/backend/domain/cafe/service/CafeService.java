package com.seatify.backend.domain.cafe.service;

import java.util.List;
import java.util.stream.Collectors;

import com.seatify.backend.api.cafe.dto.CafeInfoResponseDTO;
import com.seatify.backend.api.cafe.dto.CafeSaveRequestDTO;
import com.seatify.backend.domain.seat.repository.SeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.api.cafe.dto.CafeDTO;
import com.seatify.backend.api.comment.dto.CommentInfoDTO;
import com.seatify.backend.api.home.dto.HomeResponseDTO;
import com.seatify.backend.api.member.dto.CafeInfoViewedByMemberProjection;
import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.comment.constant.Keyword;
import com.seatify.backend.domain.comment.entity.Comment;
import com.seatify.backend.domain.commentkeyword.entity.CommentKeyword;
import com.seatify.backend.global.error.ErrorCode;
import com.seatify.backend.global.error.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CafeService {

	private final CafeRepository cafeRepository;
	private final SeatRepository seatRepository;

	private boolean containsKorean(String address) {
		return address != null && address.matches(".*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*");
	}

	private String getDefaultOpeningHoursJson() {
		return "{"
				+ "\"periods\": ["
				+ "{\"open\": {\"day\": 0, \"hour\": 10, \"minute\": 0}, \"close\": {\"day\": 0, \"hour\": 17, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 1, \"hour\": 9, \"minute\": 0}, \"close\": {\"day\": 1, \"hour\": 18, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 2, \"hour\": 9, \"minute\": 0}, \"close\": {\"day\": 2, \"hour\": 18, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 3, \"hour\": 9, \"minute\": 0}, \"close\": {\"day\": 3, \"hour\": 18, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 4, \"hour\": 9, \"minute\": 0}, \"close\": {\"day\": 4, \"hour\": 18, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 5, \"hour\": 9, \"minute\": 0}, \"close\": {\"day\": 5, \"hour\": 18, \"minute\": 0}},"
				+ "{\"open\": {\"day\": 6, \"hour\": 10, \"minute\": 0}, \"close\": {\"day\": 6, \"hour\": 17, \"minute\": 0}}"
				+ "],"
				+ "\"weekdayDescriptions\": ["
				+ "\"일요일: 오전 10:00 ~ 오후 5:00\","
				+ "\"월요일: 오전 9:00 ~ 오후 6:00\","
				+ "\"화요일: 오전 9:00 ~ 오후 6:00\","
				+ "\"수요일: 오전 9:00 ~ 오후 6:00\","
				+ "\"목요일: 오전 9:00 ~ 오후 6:00\","
				+ "\"금요일: 오전 9:00 ~ 오후 6:00\","
				+ "\"토요일: 오전 10:00 ~ 오후 5:00\""
				+ "]"
				+ "}";
	}


	@Transactional(readOnly = true)
	public HomeResponseDTO getHomeData(Long memberId) {
		return HomeResponseDTO.builder()
			.cafeCount(cafeRepository.count())
			.cafes(cafeRepository.getHomeData(memberId))
			.build();
	}
	@Transactional
	public void saveAllCafes(List<CafeSaveRequestDTO> cafeList) {
		for (CafeSaveRequestDTO dto : cafeList) {
			System.out.println("📌 카페 처리 중: " + dto.getName() + " / " + dto.getAddress());

			if (!containsKorean(dto.getAddress())) {
				System.out.println("⛔ 한글 주소가 아님 → 저장 생략: " + dto.getAddress());
				continue;
			}

			if (cafeRepository.existsByPlaceId(dto.getPlaceId())) {
				Cafe existingCafe = cafeRepository.findByPlaceId(dto.getPlaceId())
						.orElseThrow(() -> new IllegalStateException("존재한다고 했는데 못 찾음"));

				boolean updated = false;

				// 필드별로 값이 비어있으면 dto 값으로 채우기
				if (existingCafe.getPhoneNumber() == null || existingCafe.getPhoneNumber().isBlank()) {
					existingCafe.setPhoneNumber(dto.getPhoneNumber());
					updated = true;
				}

				if (existingCafe.getOpeningHours() == null || existingCafe.getOpeningHours().isBlank() ||
						"null".equalsIgnoreCase(existingCafe.getOpeningHours()) || "{}".equals(existingCafe.getOpeningHours())) {
					String raw = dto.getOpeningHours();
					String newOpeningHours = (raw == null || raw.trim().isEmpty() ||
							"null".equalsIgnoreCase(raw) || "{}".equals(raw))
							? getDefaultOpeningHoursJson()
							: raw;
					existingCafe.setOpeningHours(newOpeningHours);
					updated = true;
				}

				if (updated) {
					cafeRepository.save(existingCafe);  // update 수행
					System.out.println("♻️ 기존 카페 정보 업데이트됨: " + existingCafe.getName());
				} else {
					System.out.println("✅ 기존 카페 정보 유지됨 (변경 없음): " + existingCafe.getName());
				}

				continue;
			}

			String openingHoursRaw = dto.getOpeningHours();
			System.out.println("🕒 받은 openingHoursRaw: " + openingHoursRaw);

			String openingHours = (openingHoursRaw == null || openingHoursRaw.trim().isEmpty()
					|| "{}".equals(openingHoursRaw) || "null".equalsIgnoreCase(openingHoursRaw))
					? getDefaultOpeningHoursJson()
					: openingHoursRaw;

			System.out.println("✅ 최종 저장할 openingHours: " + openingHours);

			Cafe cafe = Cafe.builder()
					.placeId(dto.getPlaceId())
					.name(dto.getName())
					.status(dto.getStatus())
					.latitude(dto.getLatitude())
					.longitude(dto.getLongitude())
					.address(dto.getAddress())
					.phoneNumber(dto.getPhoneNumber())
					.rating(dto.getRating())
					.openingHours(openingHours)
					.reviews(dto.getReviews())
					.hasPlugCount(0)
					.isCleanCount(0)
					.build();

			cafeRepository.save(cafe);
			System.out.println("✅ 저장 완료: " + dto.getName());
		}
	}


	// 모든 카페 정보를 가져오는 메소드
	public List<CafeInfoResponseDTO> getAllCafeInfo() {
		List<Cafe> cafes = cafeRepository.findAll();  // 모든 카페 정보를 DB에서 가져옵니다.

		// 각 카페의 정보를 CafeInfoResponseDTO로 변환하여 리스트로 반환
		return cafes.stream()
				.map(cafe -> {
					return CafeInfoResponseDTO.builder()
							.cafeId(String.valueOf(cafe.getCafeId()))
							.name(cafe.getName())
							.phoneNumber(cafe.getPhoneNumber())
							.address(cafe.getAddress())
							.status(cafe.getStatus())
							.rating(cafe.getRating())
							.latitude(cafe.getLatitude())
							.longitude(cafe.getLongitude())
							.openingHours(cafe.getOpeningHours())  // openingHours도 포함
							.reviews(cafe.getReviews())
							.hasPlugCount(cafe.getHasPlugCount())  // 실제 값 사용
							.isCleanCount(cafe.getIsCleanCount())  // 실제 값 사용
							.build();
				})
				.collect(Collectors.toList());  // 리스트로 반환
	}

	@Transactional(readOnly = true)
	public CafeDTO findCafeInfoById(Long memberId, Long cafeId) {
		Cafe cafe = cafeRepository.findById(cafeId)
				.orElseThrow(() -> new EntityNotFoundException(ErrorCode.CAFE_NOT_EXIST));

		CafeInfoResponseDTO cafeInfo = CafeInfoResponseDTO.builder()
				.cafeId(String.valueOf(cafe.getCafeId()))
				.name(cafe.getName())
				.phoneNumber(cafe.getPhoneNumber())
				.address(cafe.getAddress())
				.status(cafe.getStatus())
				.rating(cafe.getRating())
				.latitude(cafe.getLatitude())
				.longitude(cafe.getLongitude())
				.openingHours(cafe.getOpeningHours()) // openingHours 필드
				.reviews(cafe.getReviews())
				.hasPlugCount(cafe.getHasPlugCount()) // 실제 값 사용
				.isCleanCount(cafe.getIsCleanCount()) // 실제 값 사용
				.build();

		return CafeDTO.builder()
				.cafeInfo(cafeInfo)
				.comments(getComments(cafeId))
				.build();
	}

	private List<CommentInfoDTO> getComments(final Long cafeId) {
		final List<Comment> comments = cafeRepository.findAllCommentByCafeId(cafeId);
		log.debug("comments: {}", comments);
		return comments.stream()
			.map(comment -> CommentInfoDTO.builder()
				.commentId(comment.getCommentId())
				.memberName(comment.getMember().getName())
				.createdTime(comment.getCreatedTime())
				.content(comment.getContent())
				.keywords(getCommentKeywords(comment))
				.build())
			.collect(Collectors.toList());
	}

	private List<Keyword> getCommentKeywords(Comment comment) {
		return comment.getKeywords().stream()
			.map(CommentKeyword::getKeyword)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<CafeInfoViewedByMemberProjection> findCafeInfoViewedByMember(final List<Long> viewedCafeIds) {
		return viewedCafeIds.stream()
			.map(cafeRepository::findCafeInfoViewedByMember)
			.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public Cafe findCafeByCafeId(final Long cafeId) {
		return cafeRepository.findById(cafeId)
			.orElseThrow(() -> new EntityNotFoundException(ErrorCode.CAFE_NOT_EXIST));
	}

	// 카페 정보 저장 메서드
	public void saveCafe(Cafe cafe) {
		cafeRepository.save(cafe);
	}
}
