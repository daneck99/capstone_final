package com.seatify.backend.domain.comment.repository;

import com.seatify.backend.domain.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findAllByCafe_cafeId(Long cafeId);

	// cafeId와 commentId를 기준으로 댓글을 찾는 메서드 추가
	Optional<Comment> findByCafe_cafeIdAndCommentId(Long cafeId, Long commentId);
}
