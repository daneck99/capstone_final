package com.seatify.backend.domain.seat.entity;

import javax.persistence.*;

import com.seatify.backend.domain.cafe.entity.Cafe;
import lombok.*;

@Entity
@Getter @Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SeatLayout {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    private int seatNumber;
    private int x;
    private int y;
    private int width;
    private int height;

    @Builder
    public SeatLayout(Cafe cafe, int seatNumber, int x, int y, int width, int height) {
        this.cafe = cafe;
        this.seatNumber = seatNumber;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
