package com.seatify.backend.domain.comment.service;

import static com.seatify.backend.api.comment.dto.CommentDTO.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.seatify.backend.api.comment.dto.CommentInfoDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.service.CafeService;
import com.seatify.backend.domain.comment.constant.Keyword;
import com.seatify.backend.domain.comment.entity.Comment;
import com.seatify.backend.domain.comment.repository.CommentRepository;
import com.seatify.backend.domain.commentkeyword.entity.CommentKeyword;
import com.seatify.backend.domain.commentkeyword.repository.CommentKeywordRepository;
import com.seatify.backend.domain.member.entity.Member;
import com.seatify.backend.domain.member.service.MemberService;
import com.seatify.backend.global.error.ErrorCode;
import com.seatify.backend.global.error.exception.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

	private final CommentRepository commentRepository;
	private final CommentKeywordRepository commentKeywordRepository;
	private final MemberService memberService;
	private final CafeService cafeService;

	public Long addComment(final CommentRequest commentRequestDTO, final Long cafeId, final Long memberId) {
		Comment comment = createCafeComment(commentRequestDTO, cafeId, memberId);
		return commentRepository.save(comment).getCommentId();
	}

	private Comment createCafeComment(final CommentRequest commentRequestDTO, final Long cafeId, final Long memberId) {
		log.debug("requestDTO.getKeywords(): {}", commentRequestDTO.getKeywords());
		final Member member = memberService.findMemberByMemberId(memberId);
		final Cafe cafe = cafeService.findCafeByCafeId(cafeId);

		// 댓글 생성 시 rating도 설정
		Comment comment = Comment.builder()
				.content(commentRequestDTO.getContent())
				.rating(commentRequestDTO.getRating()) // rating을 받음
				.cafe(cafe)
				.member(member)
				.build();

		addCommentKeyword(commentRequestDTO, comment);
		return comment;
	}

	private void addCommentKeyword(final CommentRequest commentRequestDTO, final Comment comment) {
		for (String key : commentRequestDTO.getKeywords()) {
			commentKeywordRepository.save(createCommentKeyword(comment, key));
		}
	}

	private CommentKeyword createCommentKeyword(final Comment comment, final String key) {
		return CommentKeyword.builder()
				.keyword(Keyword.from(key))
				.comment(comment)
				.build();
	}

	public void deleteComment(final Long cafeId, final Long commentId) {
		validateCafeComment(cafeId, commentId);
		commentRepository.deleteById(commentId);
	}

	public void validateCafeComment(final Long cafeId, final Long commentId) {
		// 댓글을 cafeId와 commentId로 조회
		commentRepository.findByCafe_cafeIdAndCommentId(cafeId, commentId)
				.orElseThrow(() -> new EntityNotFoundException(ErrorCode.COMMENT_NOT_FOUND));
	}

	public void updateComment(final CommentRequest commentRequestDTO, final Long cafeId, final Long commentId) {
		final List<CommentKeyword> oldKeywords = commentKeywordRepository.findAllByCommentId(commentId);

		final Set<String> oldCommentKeywords = oldKeywords.stream()
				.map((commentKeyword) -> commentKeyword.getKeyword().getKeyWord())
				.collect(Collectors.toCollection(HashSet::new));

		final Comment comment = commentRepository.findByCafe_cafeIdAndCommentId(cafeId, commentId)
				.orElseThrow(() -> new EntityNotFoundException(ErrorCode.COMMENT_NOT_FOUND));

		log.debug("oldCommentKeywords: {}", oldCommentKeywords);
		log.debug("newCommentKeywords(): {}", commentRequestDTO.getKeywords());

		if (!new HashSet<>(commentRequestDTO.getKeywords()).equals(oldCommentKeywords)) {
			updateCommentKeyword(commentRequestDTO, comment);
		}

		comment.updateContent(commentRequestDTO.getContent());
		comment.updateRating(commentRequestDTO.getRating()); // rating 업데이트
	}

	private void updateCommentKeyword(final CommentRequest commentRequestDTO, final Comment comment) {
		commentKeywordRepository.deleteAllByCommentId(comment.getCommentId());
		addCommentKeyword(commentRequestDTO, comment);
	}

	public List<CommentInfoDTO> getCommentsByCafeId(Long cafeId) {
		List<Comment> comments = commentRepository.findAllByCafe_cafeId(cafeId);

		return comments.stream()
				.map(comment -> CommentInfoDTO.builder()
						.commentId(comment.getCommentId())
						.content(comment.getContent())
						.createdTime(comment.getCreatedTime())
						.memberName(comment.getMember().getName()) // Assuming Member has getName method
						.rating(comment.getRating()) // rating 추가
						.keywords(comment.getKeywords().stream()
								.map(keyword -> keyword.getKeyword()) // Assuming Keyword has getKeyword method
								.collect(Collectors.toList()))
						.build())
				.collect(Collectors.toList());
	}
}