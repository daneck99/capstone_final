package com.seatify.backend.api.comment.dto;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class CommentDTO {

	@Getter @Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class CommentRequest {

		@Schema(name = "content", description = "댓글 내용", example = "여기 카페 너무 트렌디해요!", required = true)
		@NotNull
		private String content;

		@Schema(name = "keywords", description = "댓글 키워드", example = "[청결도, 콘센트, 화장실, 메뉴, 좌석, 분위기]")
		@Builder.Default
		private List<String> keywords = new ArrayList<>();

		@Schema(name = "rating", description = "댓글 평점", example = "5", required = true)
		@NotNull
		private int rating; // 댓글에 대한 평점을 추가

		public int getRating() {
			return rating; // rating 반환
		}
	}
}
