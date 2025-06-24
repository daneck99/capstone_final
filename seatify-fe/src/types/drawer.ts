 
import { ReactNode } from 'react';

export type DrawerName = 'logo' | 'mypage';
export interface DrawerItem {
  name: DrawerName;
  text: string;
  children: ReactNode;
}
