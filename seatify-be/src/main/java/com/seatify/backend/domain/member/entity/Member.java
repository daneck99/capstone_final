package com.seatify.backend.domain.member.entity;

import static javax.persistence.CascadeType.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import com.seatify.backend.domain.comment.entity.Comment;
import com.seatify.backend.domain.common.BaseTimeEntity;
import com.seatify.backend.domain.member.constant.MemberType;
import com.seatify.backend.domain.member.constant.Role;
import com.seatify.backend.domain.review.entity.Review;
import com.seatify.backend.global.jwt.dto.JwtTokenDTO;
import com.seatify.backend.global.util.DateTimeUtils;

@Entity
@Getter
@Setter
@DynamicInsert
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(indexes = {
		@Index(name = "idx_email_memberType", columnList = "email, memberType", unique = true),
		@Index(name = "idx_refresh_token", columnList = "refreshToken")
})
public class Member extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long memberId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private MemberType memberType;

	@Column(length = 50, nullable = false)
	private String email;

	@Column(length = 200)
	private String password;

	@Column(nullable = false, length = 20)
	private String name;

	@Column(length = 200)
	private String profile;

	@ColumnDefault("100")
	private Integer coffeeBean;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 10)
	private Role role;

	@Column(length = 250)
	private String refreshToken;

	private LocalDateTime tokenExpirationTime;

	// ✅ 새로 추가된 필드 (manager라면 본인이 관리하는 카페 ID)
	@Column(name = "managed_cafe_id")
	private Long managedCafeId;

	@OneToMany(mappedBy = "member", cascade = ALL)
	private List<Review> reviews = new ArrayList<>();

	@OneToMany(mappedBy = "member", cascade = ALL)
	private List<Comment> comments = new ArrayList<>();

	@Builder
	public Member(final Long memberId, final MemberType memberType, final String email,
				  final String password, final String name, final String profile, final Integer coffeeBean,
				  final Role role, final String refreshToken, final LocalDateTime tokenExpirationTime,
				  final Long managedCafeId) {
		this.memberId = memberId;
		this.memberType = memberType;
		this.email = email;
		this.password = password;
		this.name = name;
		this.profile = profile;
		this.coffeeBean = coffeeBean;
		this.role = role;
		this.refreshToken = refreshToken;
		this.tokenExpirationTime = tokenExpirationTime;
		this.managedCafeId = managedCafeId;
	}

	public void updateRefreshToken(final JwtTokenDTO jwtTokenDto) {
		this.refreshToken = jwtTokenDto.getRefreshToken();
		this.tokenExpirationTime = DateTimeUtils.convertDateToLocalDateTime(jwtTokenDto.getRefreshTokenExpireTime());
	}

	public void expireRefreshToken(final LocalDateTime now) {
		this.tokenExpirationTime = now;
	}

}
