package com.seatify.backend.domain.seat.constant;

public enum SeatState {
    EMPTY(0),
    OCCUPIED(1),
    STEP_OUT(2),
    LONG_STEP_OUT(3);

    private final int code;

    SeatState(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static SeatState fromCode(int code) {
        switch (code) {
            case 0:
                return EMPTY;
            case 1:
                return OCCUPIED;
            case 2:
                return STEP_OUT;
            case 3:
                return LONG_STEP_OUT;
            default:
                throw new IllegalArgumentException("Invalid seat state code: " + code);
        }
    }

}

