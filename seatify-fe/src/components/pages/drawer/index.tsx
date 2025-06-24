 
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Typography,
} from '@mui/material';

import { DrawerItem, DrawerName } from '~/types/drawer';
import { setNavigationContent } from '~/store/reducers/navigateSlice';
import { setCafeId } from '~/store/reducers/cafeIdSlice';
import { Drawer } from './drawer.styled';
import Depth1Drawer from '../depth1Drawer';

interface MainDrawerProps {
  data: DrawerItem[];
  // 상위 선택된 메뉴 (카페목록/마이페이지)
  selectedMenu: DrawerName;
  // 상위 선택된 메뉴 변경 함수
  handleSelectedMenu: (name: DrawerName) => void;
}

const MainDrawer = ({
  data,
  selectedMenu,
  handleSelectedMenu,
}: MainDrawerProps) => {
  // depth1 메뉴 오픈 여부
  const [openDepth1, setOpenDepth1] = useState(true);
  const dispatch = useDispatch();

  // depth1 메뉴 열기/닫기 함수
  const handleOpenDepth1 = useCallback(() => {
    setOpenDepth1(!openDepth1);
  }, [openDepth1]);

  const handleSelectMenuClick = (name: DrawerName) => {
    // 선택된 메뉴 상태 업데이트
    handleSelectedMenu(name);

    // cafeId 초기화
    dispatch(setCafeId({ cafeId: '', commentId: '' }));

    // 이동할 navigation 상태 설정
    dispatch(setNavigationContent(name === 'logo' ? 'cafelist' : 'mypage'));
  };


  return (
    <>
      <Drawer variant="permanent">
        <List sx={{ pt: 0 }}>
          {data.map((v) => (
            <ListItem key={v.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={selectedMenu === v.name}
                onClick={() => handleSelectMenuClick(v.name)}
              >
                <ListItemAvatar sx={{ m: '0 auto', minWidth: 'auto' }}>
                  {v.children}
                  {v.text && (
                    <Typography variant="subtitle2" textAlign="center">
                      {v.text}
                    </Typography>
                  )}
                </ListItemAvatar>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Depth1Drawer
        selectedMenu={selectedMenu}
        open={openDepth1}
        setOpen={handleOpenDepth1}
      />
    </>
  );
};

export default MainDrawer;
