package com.seatify.backend.api.cafe.dto;

import java.util.List;

import com.seatify.backend.api.comment.dto.CommentInfoDTO;
import com.seatify.backend.api.seat.dto.SeatDTO;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Builder;
import lombok.Getter;

@JsonPropertyOrder({
		"cafeInfo",
		"comments"
})
@Builder
@Getter
public class CafeDTO {
	private CafeInfoResponseDTO cafeInfo;
	private List<SeatDTO> seats; // 자리 정보 추가
	private List<CommentInfoDTO> comments;
}