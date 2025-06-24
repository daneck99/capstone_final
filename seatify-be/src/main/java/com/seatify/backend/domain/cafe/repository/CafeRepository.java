package com.seatify.backend.domain.cafe.repository;

import java.util.List;
import java.util.Optional;

import com.seatify.backend.api.cafe.dto.CafeInfoResponseDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.seatify.backend.api.home.dto.HomeProjection;
import com.seatify.backend.api.member.dto.CafeInfoViewedByMemberProjection;
import com.seatify.backend.domain.cafe.entity.Cafe;
import com.seatify.backend.domain.comment.entity.Comment;

public interface CafeRepository extends JpaRepository<Cafe, Long> {

	@Query(value = "SELECT "
		+ "c.cafe_id AS 'cafeId', "
		+ "c.name AS 'name', "
		+ "c.latitude AS 'latitude', "
		+ "c.longitude AS 'longitude', "
		+ "COALESCE(c.phone_number, '등록된 전화번호가 없습니다') AS 'phoneNumber', "
		+ "CONCAT(c.address) AS 'address', "
		+ "(COALESCE(r.review_count, 0) + COALESCE(co.comment_count, 0)) AS 'commentReviewCount', "
		+ "CASE WHEN CURRENT_TIME() BETWEEN oh.open_time AND oh.close_time THEN '영업중' ELSE '영업종료' END AS 'status', "
		+ "FROM cafe c "
		+ "LEFT JOIN "
		+ "(SELECT cafe_id, COUNT(*) AS review_count FROM review GROUP BY cafe_id) r "
		+ "ON c.cafe_id = r.cafe_id "
		+ "LEFT JOIN (SELECT cafe_id, COUNT(*) AS comment_count FROM comment GROUP BY cafe_id) co "
		+ "ON c.cafe_id = co.cafe_id "
		+ "LEFT JOIN opening_hour oh "
		+ "ON c.cafe_id = oh.cafe_id AND DATE_FORMAT(CURRENT_DATE(), '%W') = oh.day_of_week "
		+ "LEFT JOIN "
		+ "(SELECT cafe_id, AVG(CASE cafe_congestion WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HIGH' THEN 3 END) AS avg_congestion "
		+ "FROM review WHERE created_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR) GROUP BY cafe_id) "
		+ "avg_congestion ON c.cafe_id = avg_congestion.cafe_id "
		+ "LEFT JOIN "
		+ "viewed_cafe vc ON c.cafe_id = vc.cafe_id AND vc.member_id = :memberId "
		+ "ORDER BY c.cafe_id, "
		+ "(COALESCE(r.review_count, 0) + COALESCE(co.comment_count, 0)) DESC, c.name ", nativeQuery = true)
	List<HomeProjection> getHomeData(@Param("memberId") Long memberId);

	@Query(value = "SELECT "
		+ "c.cafe_id AS 'cafeId', "
		+ "c.name AS 'name', "
		+ "c.latitude AS 'latitude', "
		+ "c.longitude AS 'longitude', "
		+ "(SELECT COUNT(has_plug) FROM review r WHERE c.cafe_id = r.cafe_id AND r.has_plug=1) AS 'hasPlugCount', "
		+ "(SELECT COUNT(is_clean) FROM review r WHERE c.cafe_id = r.cafe_id AND r.is_clean=1) AS 'isCleanCount', "
		+ "COALESCE(c.phone_number, '등록된 전화번호가 없습니다') AS 'phoneNumber', "
		+ "CONCAT(c.address) AS 'address', "
		+ "c.opening_hours AS openingHours, "
		+ "(SELECT CASE WHEN COUNT(r.cafe_id) > 0 THEN 'true' ELSE 'false' END FROM  review r WHERE r.cafe_id = :cafeId) AS 'hasReviewed', "
		+ "CASE WHEN CURRENT_TIME() BETWEEN oh.open_time AND oh.close_time THEN '영업중' ELSE '영업종료' END AS 'status', "
		+ "FROM cafe c "
		+ "LEFT JOIN "
		+ "(SELECT cafe_id, COUNT(*) AS review_count FROM review GROUP BY cafe_id) r "
		+ "ON c.cafe_id = r.cafe_id "
		+ "LEFT JOIN (SELECT cafe_id, COUNT(*) AS comment_count FROM comment GROUP BY cafe_id) co "
		+ "ON c.cafe_id = co.cafe_id "
		+ "LEFT JOIN opening_hour oh "
		+ "ON c.cafe_id = oh.cafe_id AND DATE_FORMAT(CURRENT_DATE(), '%W') = oh.day_of_week "
		+ "LEFT JOIN "
		+ "(SELECT cafe_id, AVG(CASE cafe_congestion WHEN 'LOW' THEN 1 WHEN 'MEDIUM' THEN 2 WHEN 'HIGH' THEN 3 END) AS avg_congestion "
		+ "FROM review WHERE created_time >= DATE_SUB(NOW(), INTERVAL 1 HOUR) GROUP BY cafe_id) "
		+ "avg_congestion ON c.cafe_id = avg_congestion.cafe_id "
		+ "LEFT JOIN "
		+ "viewed_cafe vc ON c.cafe_id = vc.cafe_id AND vc.member_id = :memberId "
		+ "WHERE c.cafe_id = :cafeId "
		+ "ORDER BY "
		+ "(COALESCE(r.review_count, 0) + COALESCE(co.comment_count, 0)) DESC, c.name ", nativeQuery = true)
	CafeInfoResponseDTO findCafeInfoById(@Param("memberId") Long memberId, @Param("cafeId") Long cafeId);

	@Query(value = "SELECT c.name AS 'cafeName', " +
		"CONCAT(c.address) AS 'address', " +
		"((SELECT COUNT(*) FROM review r WHERE r.cafe_id = c.cafe_id) + " +
		"(SELECT COUNT(*) FROM comment co WHERE co.cafe_id = c.cafe_id)) as 'commentReviewCount' " +
		"FROM cafe c " +
		"WHERE c.cafe_id = :cafeId", nativeQuery = true)
	CafeInfoViewedByMemberProjection findCafeInfoViewedByMember(@Param("cafeId") Long cafeId);

	@Query("SELECT co FROM Comment co WHERE co.cafe.cafeId = :cafeId")
	List<Comment> findAllCommentByCafeId(@Param("cafeId") Long cafeId);

	Optional<Cafe> findByName(String name);

	Optional<Cafe> findByPlaceId(String placeId);

	long count();

	@Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Review r WHERE r.cafe.cafeId = :cafeId")
	boolean existsReviewByCafeId(Long cafeId);

    boolean existsByNameAndLatitudeAndLongitude(String name, String s, String s1);

	boolean existsByPlaceId(String placeId);

	@Query(value = "SELECT "
			+ "c.cafe_id AS cafeId, "
			+ "c.name AS name, "
			+ "c.latitude AS latitude, "
			+ "c.longitude AS longitude, "
			+ "COALESCE(c.phone_number, '등록된 전화번호가 없습니다') AS phoneNumber, "
			+ "c.address AS address, "
			+ "c.opening_hours AS openingHours, "
			+ "'false' AS hasReviewed, " // 또는 실제 리뷰 여부 컬럼이 있다면 로직에 맞게 처리
			+ "(SELECT COUNT(*) FROM review r WHERE r.cafe_id = c.cafe_id AND r.has_plug=1) AS hasPlugCount, "
			+ "(SELECT COUNT(*) FROM review r WHERE r.cafe_id = c.cafe_id AND r.is_clean=1) AS isCleanCount, "
			+ "CASE WHEN CURRENT_TIME() BETWEEN oh.open_time AND oh.close_time THEN '영업중' ELSE '영업종료' END AS status "
			+ "FROM cafe c "
			+ "LEFT JOIN opening_hour oh ON c.cafe_id = oh.cafe_id AND DATE_FORMAT(CURRENT_DATE(), '%W') = oh.day_of_week",
			nativeQuery = true)
	List<CafeInfoResponseDTO> findAllCafeInfo();

}
