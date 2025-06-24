package com.seatify.backend.domain.seat.entity;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.seat.constant.SeatState;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor // Builder에는 이게 필요함
@Builder            // ✅ builder 생성
public class SeatStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cafe_id")
    private Cafe cafe;

    @Column(nullable = false)
    private int seatNumber;

    @Enumerated(EnumType.STRING)
    private SeatState state;
}
