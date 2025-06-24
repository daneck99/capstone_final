// components/organism/reviewList/ReviewList.tsx

import { Box, Typography } from '@mui/material';

interface Review {
  authorAttribution?: {
    displayName: string;
  };
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: string;
}

const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Box mt={4}>
        <Typography variant="h4" mt="24px" mb="2px">
          등록된 리뷰
        </Typography>
        <Typography variant="h4" mt="24px" mb="2px">
        </Typography>
        <Typography variant="body2" color="text.secondary">
          등록된 리뷰가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" mt="24px" mb="2px">
        등록된 리뷰
      </Typography>
      <Typography variant="h4" mt="24px" mb="2px">
      </Typography>
      {reviews.map((review, idx) => (
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
          <Typography fontWeight="bold">{review.authorAttribution?.displayName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {review.relativePublishTimeDescription} · 평점 {review.rating}점
          </Typography>
          <Typography
            variant="body1"
            mt={1}
            sx={{
              wordBreak: 'break-word', // 또는 'break-all'
              whiteSpace: 'pre-line', // 줄바꿈(\n)도 반영
            }}
          >
            {review.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ReviewList;
