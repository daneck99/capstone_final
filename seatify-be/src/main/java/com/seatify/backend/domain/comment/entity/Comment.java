package com.seatify.backend.domain.comment.entity;

import static javax.persistence.FetchType.*;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.commentkeyword.entity.CommentKeyword;
import com.seatify.backend.domain.common.BaseTimeEntity;
import com.seatify.backend.domain.member.entity.Member;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long commentId;

	@Column(nullable = false)
	@Lob
	private String content;

	@Column(nullable = false)
	private int rating; // 평점 추가

	@OneToMany(mappedBy = "comment", orphanRemoval = true)
	List<CommentKeyword> keywords = new ArrayList<>();

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "cafe_id")
	private Cafe cafe;

	@ManyToOne(fetch = LAZY)
	@JoinColumn(name = "member_id")
	private Member member;

	@Builder
	public Comment(String content, Cafe cafe, Member member, int rating) {
		this.content = content;
		this.cafe = cafe;
		this.member = member;
		this.rating = rating; // 평점 초기화
	}

	public void updateContent(final String content) {
		this.content = content;
	}

	public void updateRating(final int rating) {
		this.rating = rating; // 평점 업데이트
	}
}
