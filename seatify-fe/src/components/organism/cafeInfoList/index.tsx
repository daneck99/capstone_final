import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';

import { Box, List, Typography, useTheme } from '@mui/material';

import { CafesInfo } from '~/types/cafeInfo';
import SearchCafe from '~/components/molecule/search';
import getAllCafeInfo from '~/pages/api/home/getAllCafeInfo';
import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { setCafeId } from '~/store/reducers/cafeIdSlice';

import { RootState } from '~/store'; // RootState 필요
import CafeInfo from './CafeInfo';
import NoCafeComment from './NoCafeComment';

interface CafeInfoListProps {
  setOpenDepth2: (openDpth2: boolean) => void;
}

const CafeInfoListPage = ({ setOpenDepth2 }: CafeInfoListProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const grayColor = theme.palette.grey[400];
  const navigate = useNavigationSelector();

  const currentViewingCafeRef = useRef<string | null>(null);

  // 검색 결과 입력
  const [searchInput, setSearchInput] = useState('');
  const [filterCafe, setFilterCafe] = useState<CafesInfo[]>([]);

  // ✅ accessToken 가져오기
  const accessToken = useSelector(
    (state: RootState) => state.auth.auth.access_token
  );

  // ✅ accessToken 전달
  // 전체 카페 정보 가져오는 react query 문
  const { data, isLoading } = useQuery(
    ['cafeList'],
    () => getAllCafeInfo(accessToken),
    {
      enabled: !!accessToken, // accessToken이 있을 때만 쿼리 실행
    }
  );

  if (isLoading) {
    return <div style={{ padding: '2rem' }}>카페 리스트를 불러오는 중...</div>;
  }

  // 검색어 입력하는 값 update 하는 함수
  const searchInputSetHandler = useCallback(
    (s: string) => {
      setSearchInput(s);

      // 검색어 필터링 부분
      const filteredCafes =
        data?.filter((cafe: CafeInfo) => {
          const cafeNameLower = cafe.name.toLowerCase().replace(/\s/g, '');
          const searchInputLower = s.toLowerCase().replace(/\s/g, '');
          return cafeNameLower.includes(searchInputLower);
        }) || [];
      setFilterCafe(filteredCafes);
    },
    [data]
  );

  // 카페 아이템을 클릭했을 때 실행
  const cafeClickHandler = useCallback(
    async (id: string) => {
      const prevCafeId = currentViewingCafeRef.current;
      const newCafeId = id;

      if (prevCafeId && prevCafeId !== newCafeId) {
        try {
          await fetch(
            `http://localhost:8080/api/cafe-view/end?cafe_id=${prevCafeId}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } catch (err) {
          console.warn('이전 카페 종료 실패:', err);
        }
      }

      try {
        // ✅ 새 카페 시청 시작
        await fetch(
          `http://localhost:8080/api/cafe-view/start?cafe_id=${newCafeId}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        currentViewingCafeRef.current = newCafeId;

        // ✅ 시청자 수 조회
        const res = await fetch(
          `http://localhost:8080/api/cafe-view/count?cafe_id=${newCafeId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const count = await res.json();
        console.log(`현재 ${newCafeId}번 카페를 보고 있는 사람 수: ${count}`);
      } catch (err) {
        console.warn('새 카페 시작 또는 시청자 수 조회 실패:', err);
      }

      // ✅ 기존 로직
      setOpenDepth2(true);
      dispatch(setCafeId({ cafeId: newCafeId, commentId: '' }));
      if (navigate === 'search-list') {
        dispatch(setNavigationContent('search-detail'));
      } else {
        dispatch(setNavigationContent('content'));
      }
    },
    [setOpenDepth2, dispatch, navigate, accessToken, data]
  );

  return (
    <Box>

      {/* 카페 전체 정보 리스트 */}
      <List>
        {data &&
          (navigate === 'cafelist' ||
            navigate === 'search' ||
            navigate === 'content' ||
            navigate === 'comment' ||
            navigate === 're-comment' ||
            navigate === 'write' ||
            searchInput === '') && (
            <>
              <Typography ml="30px" color={grayColor}>
                총 {data?.length}개 카페
              </Typography>
              {data?.map((cafe: CafesInfo, index: number) => (
                <CafeInfo
                  key={index}
                  cafeClickHandler={() => cafeClickHandler(cafe.cafeId)}
                  cafes={cafe}
                />
              ))}
            </>
          )}

        {/* 검색 후 카페 리스트가 없을 때 */}
        {(navigate === 'search-list' || navigate === 'search-detail') &&
          filterCafe.length === 0 && (
            <NoCafeComment searchInput={searchInput} />
          )}

        {/* 검색 후 카페 리스트 1개 이상일 때 */}
        {(navigate === 'search-list' ||
          navigate === 'search-detail' ||
          navigate === 'search-write' ||
          navigate === 'search-re-comment' ||
          navigate === 'search-comment') &&
          filterCafe.length > 0 && (
            <>
              {filterCafe.map((filter: CafesInfo, index: number) => (
                <CafeInfo
                  key={index}
                  cafeClickHandler={() => cafeClickHandler(filter.cafeId)}
                  cafes={filter}
                />
              ))}
            </>
          )}
      </List>
    </Box>
  );
};
export default CafeInfoListPage;
