package com.seatify.backend.api.cafe.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CafeInfoResponseDTO {

    @Schema(description = "카페 ID", example = "1", required = true)
    private String cafeId;

    @Schema(description = "카페 이름", example = "5to7", required = true)
    private String name;

    @Schema(description = "전화번호", example = "050713337616", required = true)
    private String phoneNumber;

    @Schema(description = "카페 주소", example = "서울시 성동구 서울숲2길44-13 1층", required = true)
    private String address;

    @Schema(description = "영업 상태", example = "영업중", required = true)
    private String status;

    @Schema(description = "콘센트 리뷰 수", example = "5", required = true)
    private int hasPlugCount;

    @Schema(description = "청결도 리뷰 수", example = "0", required = true)
    private int isCleanCount;

    @Schema(description = "별점 평균", example = "4.2", required = true)
    private String rating;

    @Schema(description = "위도", example = "37.5460707", required = true)
    private String latitude;

    @Schema(description = "경도", example = "127.043297", required = true)
    private String longitude;

    @Schema(description = "영업 시간", example = "{\"weekdayDescriptions\":[\"월요일: 오전 10:00 ~ 오후 10:00\"]}", required = true)
    private String openingHours; // ✅ 추가된 필드

    @Schema(description = "리뷰", example = "", required = true)
    private String reviews; // ✅ 추가된 필드
}
