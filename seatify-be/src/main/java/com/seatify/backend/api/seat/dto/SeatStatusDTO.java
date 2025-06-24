package com.seatify.backend.api.seat.dto;
import com.seatify.backend.domain.seat.constant.SeatState;

public class SeatStatusDTO {
    private String seatID;
    private SeatState state;  // enum으로 바로 받기 위해서
}