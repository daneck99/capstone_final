import { useState, useEffect, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Button,
} from '@mui/material';

import Setting from '~/static/images/setting.svg';
import Badge from '~/static/images/badge.png';
import Profile from '~/components/atom/profile';
import TabContainer from '~/components/organism/mypage/TabContainer';
import { setNavigationContent } from '~/store/reducers/navigateSlice';
import { RootState } from '~/store';
import { setToken } from '~/store/reducers/authSlice'; // ✅ 토큰 업데이트용 액션
import ManagerAuthModal from '~/components/molecule/mypage/ManagerAuthModal';
import { ProfileContainer, BadgeImg } from './mypage.styled';

const MyPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = typeof window !== 'undefined' ? useRouter() : null;


  const accessToken = useSelector(
    (state: RootState) => state.auth.auth.access_token
  );
  const managedCafeId = useSelector(
    (state: RootState) => state.auth.auth.managed_cafe_id
  );

  const [currentCafeId, setCurrentCafeId] = useState(managedCafeId);
  const [openModal, setOpenModal] = useState(false);
  const [cafeList, setCafeList] = useState<any[]>([]);

  const currentCafeName = cafeList.find(
    (cafe) => cafe.cafeId.toString() === managedCafeId?.toString()
  )?.name;

  const memberName = useSelector(
    (state: RootState) => state.auth.auth.member_name
  );

  // ✅ 마이페이지 진입시 항상 최신 내 정보 불러오기
  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/member/info', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const {
          accessToken: tokenFromServer,
          managedCafeId: cafeFromServer,
          memberName: nameFromServer,
        } = res.data;

        // 만약 토큰 형태가 바뀌지 않는다면 그냥 managedCafeId만 갱신
        dispatch(
          setToken({
            access_token: accessToken,
            managed_cafe_id: cafeFromServer,
            member_name: nameFromServer, // 이걸 추가
          })
        );
      } catch (err) {
        console.error('내 정보 불러오기 실패', err);
      }
    };

    if (accessToken) fetchMyInfo();
  }, [dispatch, accessToken]);

  useEffect(() => {
    setCurrentCafeId(managedCafeId);
  }, [managedCafeId]);

  useEffect(() => {
    const fetchCafeList = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/cafes', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setCafeList(data);
      } catch (err) {
        console.error('cafeList 불러오기 실패', err);
      }
    };

    if (accessToken) fetchCafeList();
  }, [accessToken]);

  return (
    <Box>
      <Box>
        <IconButton sx={{ position: 'absolute', right: 20, top: 20 }}>
          <Image
            src={Setting}
            alt="setting"
            width={24}
            height={24}
            onClick={() => {
              dispatch(setNavigationContent('setting'));
            }}
          />
        </IconButton>
        <ProfileContainer>
          <BadgeImg src={Badge} alt="edit" />
          <IconButton>
            <Profile size="lg" />
          </IconButton>
          <Typography variant="h3">{memberName}</Typography>

          {currentCafeId && (
            <Typography
              variant="h5"
              sx={{ mt: 1, color: theme.palette.grey[600] }}
            >
              {currentCafeName} 사장님
            </Typography>
          )}
        </ProfileContainer>
      </Box>

      <Divider sx={{ borderWidth: 3, borderColor: theme.palette.grey[100] }} />

      {managedCafeId ? (
        <Suspense fallback={<div>loading...</div>}>
          <TabContainer accessToken={accessToken} storeId={currentCafeId} />
        </Suspense>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            아직 사장님 인증이 완료되지 않았습니다.
          </Typography>
          <Button variant="contained" onClick={() => setOpenModal(true)}>
            사장님 인증하기
          </Button>
        </Box>
      )}

      <ManagerAuthModal open={openModal} onClose={() => setOpenModal(false)} />
    </Box>
  );
};

export default MyPage;
