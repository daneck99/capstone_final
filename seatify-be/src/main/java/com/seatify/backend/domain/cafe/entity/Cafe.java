package com.seatify.backend.domain.cafe.entity;

import static javax.persistence.CascadeType.*;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.seatify.backend.domain.comment.entity.Comment;
import com.seatify.backend.domain.common.BaseTimeEntity;

import com.seatify.backend.domain.seat.entity.Seat;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cafe extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cafeId;

	@Column(nullable = false, unique = true)
	private String placeId;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String status;

	@Column(nullable = false)
	private String address;

	@Setter
    @Column(length = 20)
	private String phoneNumber;

	@Column(length = 20)
	private String latitude;

	@Column(length = 20)
	private String longitude;

	@Setter
    @Column(columnDefinition = "TEXT")
	private String openingHours;

	@Column(columnDefinition = "TEXT")
	private String reviews;

	@Column(length = 10)
	private String rating;

    // 리뷰 추가를 위한 메서드
    // ✅ 새로 추가된 필드들
	@Setter
    @Column(nullable = false)
	private int hasPlugCount = 0;

	@Setter
    @Column(nullable = false)
	private int isCleanCount = 0;

	@OneToMany(mappedBy = "cafe", cascade = ALL, orphanRemoval = true)
	private List<Comment> comments = new ArrayList<>();

	@OneToMany(mappedBy = "cafe", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Seat> seats = new ArrayList<>(); // 여러 자리 정보를 담는 리스트

	@Builder
	public Cafe(String placeId, String name, String status, String address, String phoneNumber,
				String latitude, String longitude, String openingHours, String reviews, String rating,
				int hasPlugCount, int isCleanCount) {
		this.placeId = placeId;
		this.name = name;
		this.status = status;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.latitude = latitude;
		this.longitude = longitude;
		this.openingHours = openingHours;
		this.reviews = reviews;
		this.rating = rating;
		this.hasPlugCount = hasPlugCount;
		this.isCleanCount = isCleanCount;
	}

}
