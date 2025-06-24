package com.seatify.backend.domain.seat.repository;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.seat.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByCafe(Cafe cafe);

    List<Seat> findByCafe_CafeId(Long cafeId);

    Optional<Seat> findByCafe_CafeIdAndSeatNumber(Long cafeId, Integer seatNumber);

    void deleteByCafe_CafeId(Long cafeId);
}
