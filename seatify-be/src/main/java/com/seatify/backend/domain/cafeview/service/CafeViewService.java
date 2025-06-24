package com.seatify.backend.domain.cafeview.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class CafeViewService {

    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 사용자가 특정 카페를 보기 시작할 때 호출
     */
    public void startViewing(String cafeId, String userId) {
        String key = getRedisKey(cafeId);
        redisTemplate.opsForSet().add(key, userId);
        redisTemplate.expire(key, Duration.ofMinutes(1)); // TTL 1분 (자동 만료)
    }

    /**
     * 사용자가 해당 카페 보는 걸 종료할 때 호출
     */
    public void endViewing(String cafeId, String userId) {
        String key = getRedisKey(cafeId);
        redisTemplate.opsForSet().remove(key, userId);
    }

    /**
     * 현재 해당 카페를 동시에 보고 있는 유저 수 반환
     */
    public Long getViewerCount(String cafeId) {
        String key = getRedisKey(cafeId);
        return redisTemplate.opsForSet().size(key);
    }

    private String getRedisKey(String cafeId) {
        return "cafe_viewers:" + cafeId;
    }
}
