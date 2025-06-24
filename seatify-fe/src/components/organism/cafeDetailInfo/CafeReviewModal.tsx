 
import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Button, Typography, useTheme } from '@mui/material';

import Modal from '~/components/atom/modal';
import { RadioReviewButtons } from '~/components/molecule/radioButtons';
import addCafeReview from '~/pages/api/cafe/addCafeReview';
import { ReviewContent, ReviewTitle } from './cafeDetailInfo.styled';

interface ReviewProps {
  cafeId: string;
  open: boolean;
  onClose: () => void;
  title: string;
  reviewSuccess: () => void;
}

const CafeReviewModal = ({
  cafeId,
  open,
  onClose,
  title,
  reviewSuccess,
}: ReviewProps) => {
  const theme = useTheme();
  const grayColor = theme.palette.grey[100];

  const [cafeCongestion, setCafeCongestion] = useState<string>('');
  const [hasPlug, setHasPlug] = useState<string>('');
  const [isClean, setIsClean] = useState<string>('');

  // 리뷰 작성 react query문
  const queryClient = useQueryClient();
  const { mutate } = useMutation(addCafeReview, {
    onSuccess: () => {
      queryClient.invalidateQueries(['coffeeBean']);
      reviewSuccess();
    },
  });

  // 모달 취소
  const handleReviewModalClose = useCallback(() => {
    onClose();
    setCafeCongestion('');
    setHasPlug('');
    setIsClean('');
  }, [onClose]);

  // 혼잡도 상태 update
  const handleCafeCongestionChange = useCallback((data: string) => {
    setCafeCongestion(data);
  }, []);

  // 플러그 유무 상태 update
  const handleHasPlugChange = useCallback((data: string) => {
    setHasPlug(data);
  }, []);

  // 청결도 상태 update
  const handleIsCleanChange = useCallback((data: string) => {
    setIsClean(data);
  }, []);

  // 카페 리뷰 등록 함수
  const handleCafeReview = () => {
    const body = { cafeId, cafeCongestion, hasPlug, isClean };
    mutate(body);
    handleReviewModalClose();
  };

  // 등록 버튼 비활성화 함수
  const isButtonDisabled = () => {
    return cafeCongestion === '' || hasPlug === '' || isClean === '';
  };

  return (
    <Modal open={open} onClose={handleReviewModalClose} width="40%">
      <ReviewTitle color={grayColor}>
        <Button color="secondary" onClick={handleReviewModalClose}>
          취소
        </Button>
        <Typography variant="h5">{title}</Typography>
        <Button onClick={handleCafeReview} disabled={isButtonDisabled()}>
          등록
        </Button>
      </ReviewTitle>

      <ReviewContent color={grayColor}>
        <RadioReviewButtons
          type="cafeCongestion"
          state={cafeCongestion}
          setState={handleCafeCongestionChange}
        />
      </ReviewContent>

      <ReviewContent color={grayColor}>
        <RadioReviewButtons
          type="isClean"
          state={isClean}
          setState={handleIsCleanChange}
        />
      </ReviewContent>

      <ReviewContent color={grayColor}>
        <RadioReviewButtons
          type="hasPlug"
          state={hasPlug}
          setState={handleHasPlugChange}
        />
      </ReviewContent>
    </Modal>
  );
};
export default CafeReviewModal;
