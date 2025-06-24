package com.seatify.backend.domain.seat.entity;

import javax.persistence.*;

import com.seatify.backend.domain.cafe.entity.Cafe;
import lombok.*;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seatId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe; // 카페와 관계 설정

    @Column(nullable = false)
    private int seatNumber; // 자리 번호

    @Setter
    @Column(nullable = false)
    private boolean isOccupied; // 자리가 사용 중인지 여부

    @Column(nullable = false)
    private int x; // 좌표 X

    @Column(nullable = false)
    private int y; // 좌표 Y

    @Column(nullable = false)
    private int width; // 좌석 영역 너비

    @Column(nullable = false)
    private int height; // 좌석 영역 높이

    @Builder
    public Seat(Cafe cafe, int seatNumber, boolean isOccupied, int x, int y, int width, int height) {
        this.cafe = cafe;
        this.seatNumber = seatNumber;
        this.isOccupied = isOccupied;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public void setCafeId(long cafeId) {
    }

    public void setIsOccupied(boolean b) {
    }
}
