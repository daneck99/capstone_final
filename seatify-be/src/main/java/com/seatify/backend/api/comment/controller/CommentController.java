package com.seatify.backend.api.comment.controller;

import static com.seatify.backend.api.comment.dto.CommentDTO.*;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import com.seatify.backend.api.comment.dto.CommentInfoDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.seatify.backend.domain.comment.service.CommentService;
import com.seatify.backend.global.resolver.MemberInfo;
import com.seatify.backend.global.resolver.MemberInfoDTO;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import springfox.documentation.annotations.ApiIgnore;

@Tag(name = "cafe", description = "카페 관련 API")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CommentController {

	private final CommentService commentService;

	// 댓글 등록 API
	@Tag(name = "cafe")
	@Operation(summary = "카페 댓글 등록 API", description = "카페에 댓글을 추가하는 API 입니다. 키워드는 중복 선택이 가능합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "CO-001", description = "해당 키워드는 존재하지 않습니다.")
	})
	@PostMapping("/cafe/{cafeId}/comment")
	public ResponseEntity<String> addComment(@Valid @RequestBody CommentRequest commentRequestDTO,
											 @ApiIgnore @MemberInfo MemberInfoDTO memberInfoDTO,
											 @PathVariable Long cafeId) {
		final Long commentId = commentService.addComment(commentRequestDTO, cafeId, memberInfoDTO.getMemberId());
		return ResponseEntity.created(URI.create("/api/cafe/" + cafeId + "/comment/" + commentId)).build();
	}

	// 댓글 수정 API
	@Tag(name = "cafe")
	@Operation(summary = "카페 댓글 수정 API", description = "카페의 댓글을 수정하는 API 입니다. 키워드는 중복 선택이 가능합니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "CO-002", description = "카페에 해당하는 댓글이 존재하지 않습니다.")
	})
	@PatchMapping("/cafe/{cafeId}/comment/{commentId}")
	public ResponseEntity<String> updateComment(@Valid @RequestBody CommentRequest commentRequestDTO,
												@PathVariable Long cafeId,
												@PathVariable Long commentId) {
		commentService.updateComment(commentRequestDTO, cafeId, commentId);
		return ResponseEntity.ok("comment updated");
	}

	// 댓글 삭제 API
	@Tag(name = "cafe")
	@Operation(summary = "카페 댓글 삭제 API", description = "카페의 댓글을 삭제하는 API 입니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "CO-002", description = "카페에 해당하는 댓글이 존재하지 않습니다.")
	})
	@DeleteMapping("/cafe/{cafeId}/comment/{commentId}")
	public ResponseEntity<String> deleteComment(@PathVariable Long cafeId,
												@PathVariable Long commentId) {
		commentService.deleteComment(cafeId, commentId);
		return ResponseEntity.ok("comment deleted");
	}

	// 댓글 조회 API 추가
	@Tag(name = "cafe")
	@Operation(summary = "카페 댓글 조회 API", description = "카페에 대한 모든 댓글을 조회하는 API 입니다.")
	@ApiResponses({
			@ApiResponse(responseCode = "CO-003", description = "카페에 해당하는 댓글이 존재하지 않습니다.")
	})
	@GetMapping("/cafe/{cafeId}/comment")
	public ResponseEntity<List<CommentInfoDTO>> getComments(@PathVariable Long cafeId) {
		List<CommentInfoDTO> comments = commentService.getCommentsByCafeId(cafeId);
		if (comments.isEmpty()) {
			return ResponseEntity.noContent().build(); // 댓글이 없으면 204 반환
		}
		return ResponseEntity.ok(comments); // 댓글 리스트 반환
	}
}