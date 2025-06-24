package com.seatify.backend.api.cafe.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CafeSaveRequestDTO {
    private String placeId;
    private String name;
    private String latitude;
    private String longitude;
    private String address;
    private String phoneNumber;
    private String status;
    private String rating; // number → String
    private String openingHours; // JSON.stringify() 된 문자열
    private String reviews;      // JSON.stringify() 된 문자열

    // ✅ 추가된 필드들
    private int hasPlugCount;
    private int isCleanCount;
}