package com.seatify;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.cafe.repository.CafeRepository;
import com.seatify.backend.domain.seat.entity.Seat;
import com.seatify.backend.domain.seat.repository.SeatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@SpringBootApplication
public class SpringApiAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringApiAppApplication.class, args);
	}

	@Bean
	public CommandLineRunner insertDummySeats(SeatRepository seatRepository, CafeRepository cafeRepository) {
		return args -> {
			if (seatRepository.count() == 0) {
				for (long cafeId = 1; cafeId <= 40; cafeId++) {
					Optional<Cafe> optionalCafe = cafeRepository.findById(cafeId);
					if (optionalCafe.isEmpty()) {
						System.out.println("❌ Cafe ID " + cafeId + " not found. Skipping.");
						continue;
					}

					Cafe cafe = optionalCafe.get();

					for (int i = 1; i <= 5; i++) {
						Seat seat = Seat.builder()
								.cafe(cafe)
								.seatNumber(i)
								.isOccupied(ThreadLocalRandom.current().nextBoolean())
								.x(100 * i)
								.y(100 * i)
								.width(50)
								.height(50)
								.build();

						seatRepository.save(seat);
					}
				}
				System.out.println("✅ 좌석 더미 데이터 삽입 완료 (카페 1~40, 각 5개)");
			} else {
				System.out.println("ℹ️ 좌석 데이터가 이미 존재하여 삽입 생략");
			}
		};
	}
}
