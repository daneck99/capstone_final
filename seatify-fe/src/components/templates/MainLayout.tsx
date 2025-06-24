import { ReactNode, Suspense, useCallback, useState } from 'react';
import Image from 'next/image';

import { Box } from '@mui/material';

import Logo from '~/static/images/logo.png';

import { DrawerItem, DrawerName } from '~/types/drawer';
import Drawer from '~/components/pages/drawer';
import Profile from '~/components/atom/profile';
import { useNavigationSelector } from '~/store/reducers/navigateSlice';

interface MainLayoutProps {
  children: ReactNode;
}

const drawerItems: DrawerItem[] = [
  {
    name: 'logo',
    text: '',
    children: <Image src={Logo} alt="로고 이미지" width={30} height={30} />,
  },
  { name: 'mypage', text: '마이', children: <Profile size="sm" /> },
];

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigationSelector();

  const [selectedMenu, setSelectedMenu] = useState<DrawerName>('logo');

  const handleSelectedMenu = useCallback((name: DrawerName) => {
    setSelectedMenu(name);
  }, []);

  return (
      <Box style={{ display: 'flex' }}>
        {/* PC 용 Side Menu 영역 */}
        <Drawer
            data={drawerItems}
            selectedMenu={selectedMenu}
            handleSelectedMenu={handleSelectedMenu}
        />
        <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'gray' }}>
          {children}
        </Box>
      </Box>
  );
};

export default MainLayout;
