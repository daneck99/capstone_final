package com.seatify.backend.api.seat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatDTO {
    private Long seatID;
    private int x;
    private int y;
    private int width;
    private int height;
    private String state;  // empty_table, using_table, step_out, long_step_out
}
