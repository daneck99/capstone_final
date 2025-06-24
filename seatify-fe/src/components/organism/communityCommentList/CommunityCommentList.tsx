import { useQuery } from '@tanstack/react-query';
import { Box, Typography, CircularProgress } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { KeywordChip } from '../../atom/KeywordChip';

interface CommunityCommentListProps {
  cafeId: string;
  token: string;
}

// 데이터 가져오기 함수
const fetchComments = async (cafeId: string, token: string) => {
  const res = await fetch(`http://localhost:8080/api/cafe/${cafeId}/comment`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(`응답 실패: ${res.status}`);
    return [];
  }

  const text = await res.text();

  if (!text) {
    console.warn('빈 응답 수신');
    return [];
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('JSON 파싱 에러:', e);
    return [];
  }
};


const getStarRating = (rating?: number) => {
  const stars = [];
  const starValue = rating ?? 0;
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= starValue ? (
        <StarIcon key={i} sx={{ color: '#FFD700' }} />
      ) : (
        <StarBorderIcon key={i} sx={{ color: '#FFD700' }} />
      )
    );
  }
  return stars;
};

const keywordMap: Record<string, string> = {
  CLEAN: '🧼 청결해요',
  SEAT: '💺 좌석이 넉넉해요',
  PLUG: '🔌 콘센트가 많아요',
  MOOD: '✨ 분위기가 좋아요',
  RESTROOM: '🚻 화장실이 깨끗해요',
  MENU: '📋 메뉴 구성이 좋아요',
};

const CommunityCommentList = ({ cafeId, token }: CommunityCommentListProps) => {
  // useQuery를 사용하여 데이터를 fetch하고 상태를 관리
  const { data, isLoading, error } = useQuery(
    ['community-comments', cafeId],
    () => fetchComments(cafeId, token),  // 커스텀 fetch 함수 호출
    {
      // 데이터가 없으면 빈 배열을 반환
      onError: (err) => {
        console.error('댓글 불러오기 오류:', err);
      },
    }
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
        <Typography variant="h6" color="error">
          댓글을 불러오는 데 실패했습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={2}>
      {data && data.length > 0 ? (
        data.map((review: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              mb: 2,
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography fontWeight="bold">{review.memberName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(review.createdTime).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
              평점 {review.rating}점
              <Box display="inline-flex" alignItems="center" ml={1}>
                {getStarRating(review.rating)}
              </Box>
            </Typography>

            <Typography variant="body1" mt={1}>
              {review.content}
            </Typography>
            {/* 댓글에 포함된 키워드도 화면에 표시 */}
            <Box mt={1} display="flex" flexWrap="wrap">
              {review.keywords?.map((k: string, idx: number) => (
                <KeywordChip key={idx}>{keywordMap[k] || k}</KeywordChip>
              ))}
            </Box>
          </Box>
        ))
      ) : (
        <Typography>등록된 리뷰가 없습니다.</Typography>
      )}
    </Box>
  );
};

export default CommunityCommentList;
