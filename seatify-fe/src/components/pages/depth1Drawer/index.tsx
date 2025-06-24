 
import { useState, useEffect, Suspense } from 'react';

import { Box } from '@mui/material';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

import { DrawerName } from '~/types/drawer';
import MyPage from '~/components/organism/mypage';
import { useCafeIdSelector } from '~/store/reducers/cafeIdSlice';
import Depth2Drawer from '~/components/pages/depth2Drawer';
import { Drawer } from '~/components/pages/drawer/drawer.styled';
import CafeInfoListPage from '~/components/organism/cafeInfoList';
import { useNavigationSelector } from '~/store/reducers/navigateSlice';
import { Depth1Box, SwipeButton, CloseButton } from './depth1Drawer.styled';

interface IDepth1Drawer {
  // 상위 선택된 메뉴 (카페목록/마이페이지)
  selectedMenu: DrawerName;
  open: boolean;
  setOpen: () => void;
}

const Depth1Drawer = ({ selectedMenu, open, setOpen }: IDepth1Drawer) => {
  const cafeId = useCafeIdSelector();
  const navigate = useNavigationSelector();

  // depth2 메뉴 오픈 여부
  const [openDepth2, setOpenDepth2] = useState(false);

  useEffect(() => {

    if (cafeId?.cafeId) {
      setOpenDepth2(true); // ✅ cafeId가 설정되면 자동으로 Depth2 오픈
    } else if (
      navigate === 'mypage' ||
      navigate === 'cafelist' ||
      navigate === 'search' ||
      navigate === 'search-list'
    ) {
      setOpenDepth2(false);
    }
  }, [cafeId, navigate]);

  // depth1 메뉴 열기/닫기 handler 함수
  const handleOpen = () => {
    // depth1이 비활성화인 경우 depth2도 같이 비활성화
    if (open) {
      setOpenDepth2(false);
    }
    // open 이 true인 경우 fasle로, fals인 경우 true로 변경
    setOpen();
  };

  return (
    <Depth1Box>
      <Drawer variant="permanent" isSecondProps open={open}>
        {/* 카페 리스트 컴포넌트 */}
        {selectedMenu === 'logo' && (
          <Suspense fallback={<div>loading...</div>}>
            <CafeInfoListPage setOpenDepth2={setOpenDepth2} />
          </Suspense>
        )}
        {/* 마이 페이지 컴포넌트 */}
        {selectedMenu === 'mypage' && <MyPage />}
      </Drawer>

      <Suspense fallback={<div>loading...</div>}>
        <Depth2Drawer open={openDepth2} />
      </Suspense>

      <Box display="flex" flexDirection="column">
        {/* Depth2 활성화된 경우 Close 버튼 표시 */}
        {openDepth2 && (
          <CloseButton onClick={() => setOpenDepth2(false)}>
            <CloseIcon fontSize="small" color="info" />
          </CloseButton>
        )}

        {/* Depth1 활성화된 경우 Close 버튼 표시 */}
        <Box flexGrow={1} display="flex" alignItems="center">
          <SwipeButton onClick={handleOpen}>
            {open ? (
              <ArrowLeftIcon fontSize="small" color="primary" />
            ) : (
              <ArrowRightIcon fontSize="small" color="primary" />
            )}
          </SwipeButton>
        </Box>
      </Box>
    </Depth1Box>
  );
};

export default Depth1Drawer;
