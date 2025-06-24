import { useCallback, useMemo, useState } from 'react';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';

import { WriteButton } from '~/components/atom/buttons';
import { ActionButton } from '~/types/popup';
import CafeResponsePopup from '~/components/molecule/cafeResponsePopup';
import { useNavigationSelector } from '~/store/reducers/navigateSlice';
import { useCafeIdSelector } from '~/store/reducers/cafeIdSlice';
import CafeReviewModal from './CafeReviewModal';
import {
  CafeStatusTypography,
  CafeTitle,
  CafeTitleContainer,
} from './cafeDetailInfo.styled';

interface CafeDetailTitleProps {
  name: string;
  openStatus: string; // "영업중", "영업종료", "영업정보없음"
  openingHourText?: string; // "09:00 ~ 18:00" 같은 텍스트
  address: string;
}

const CafeDetailTitle = ({
  name,
  openStatus,
  openingHourText,
  address,
}: CafeDetailTitleProps) => {
  const { cafeId } = useCafeIdSelector();
  const theme = useTheme();
  const navigate = useNavigationSelector();
  const grayColor = theme.palette.grey[100];

  // 리뷰 등록 모달 상태
  const [reviewOpen, setReviewOpen] = useState<boolean>(false);
  const [reviewPopUp, setReviewPopUp] = useState<boolean>(false);

  const openReviewHandler = useCallback(() => setReviewOpen(true), []);
  const openReviewPopup = useCallback(() => setReviewPopUp(true), []);
  const closePopup = useCallback(() => setReviewPopUp(false), []);
  const onConfirm = useCallback(() => closePopup(), [closePopup]);

  const actions: ActionButton[] = useMemo(
    () => [
      {
        title: '다른 카페 정보 보러가기',
        type: 'confirm',
        onClick: onConfirm,
      },
      { title: '확인', type: 'close', onClick: closePopup },
    ],
    [closePopup, onConfirm]
  );

  const closeReviewHandler = useCallback(() => setReviewOpen(false), []);

  const statusColor =
    openStatus === '영업중'
      ? '#bbeba7'
      : openStatus === '영업정보없음'
      ? grayColor
      : '#f2c8c4';

  return (
    <Box>
      <CafeReviewModal
        cafeId={cafeId}
        open={reviewOpen}
        onClose={closeReviewHandler}
        title={name}
        reviewSuccess={openReviewPopup}
      />
      <CafeResponsePopup
        openPopup={reviewPopUp}
        actions={actions}
        closePopup={closePopup}
        type="success"
      />

      <CafeTitle>
        <Box>
          <Typography variant="h3" mr="4px" mt="7px">
            {name}
          </Typography>
          <CafeTitleContainer>
            {navigate === 'search-detail' && <CallIcon className="mui-icon" />}
            <CafeStatusTypography color={statusColor} variant="subtitle2">
              {openStatus}
              {openingHourText ? ` (${openingHourText})` : ''}
            </CafeStatusTypography>
          </CafeTitleContainer>
        </Box>
        <WriteButton onClick={openReviewHandler} />
      </CafeTitle>
    </Box>
  );
};

export default CafeDetailTitle;
