import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '~/store';
import { setToken } from '~/store/reducers/authSlice';
import axios from 'axios';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Modal from '~/components/atom/modal/index';

interface Cafe {
  cafeId: string;
  cafeName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const ManagerAuthModal = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.auth.access_token);
  const [cafeList, setCafeList] = useState<Cafe[]>([]);
  const [selectedCafeId, setSelectedCafeId] = useState<string>('');

  const fetchCafesFromDB = async (token: string) => {
    const res = await fetch('http://localhost:8080/api/cafes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('DB에서 카페 정보 불러오기 실패');
    return res.json();
  };

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const cafes = await fetchCafesFromDB(accessToken);
        setCafeList(cafes);
      } catch (err) {
        console.error('카페 목록 로드 실패:', err);
      }
    };
    fetchCafes();
  }, [accessToken]);

  const handleSubmit = async () => {
    if (!selectedCafeId) return;

    await axios.patch(
        'http://localhost:8080/api/member/managed-cafe',
        { managedCafeId: selectedCafeId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // 인증 성공 후 내 정보 다시 가져오기
    const res = await axios.get('http://localhost:8080/api/member/info', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = res.data;

    dispatch(setToken({
      access_token: accessToken,
      managed_cafe_id: userData.managed_cafe_id,
      role: userData.role, // 추가 가능하면 권장
    }));

    onClose();
  };


  return (
      <Modal open={open} onClose={onClose} width="400px" height="auto" isBorder="16px">
        <Box sx={{ p: 3 }}>
          <Typography variant="h3" gutterBottom>
            사장님 인증
          </Typography>

          <FormControl fullWidth sx={{ my: 3 }}>
            <Typography variant="h5" sx={{ textAlign: 'left' }} gutterBottom>
              매장 선택
            </Typography>
            <Select
                value={selectedCafeId}
                onChange={(e) => setSelectedCafeId(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: '#fff', // 완전 흰색
                    },
                  },
                }}
            >
              {cafeList.map(cafe => (
                  <MenuItem key={cafe.cafeId} value={String(cafe.cafeId)}>
                    {cafe.name}
                  </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
              variant="contained"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem' }}
              onClick={handleSubmit}
              disabled={!selectedCafeId}
          >
            인증 완료하기
          </Button>
        </Box>
      </Modal>
  );
};

export default ManagerAuthModal;
