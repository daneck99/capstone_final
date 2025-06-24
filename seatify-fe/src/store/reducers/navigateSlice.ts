/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState, useAppSelector } from '~/store';

type Navigation =
  | 'cafelist'
  | 'mypage'
  | 'content'
  | 'comment'
  | 're-comment'
  | 'write'
  | 'search'
  | 'search-detail'
  | 'search-list'
  | 'search-comment'
  | 'search-re-comment'
  | 'search-write'
  | 'search'
  | 'setting';

export interface NavigationContent {
  navigation_content: Navigation;
}

export interface NavigationContentState {
  navigationContent: NavigationContent;
}

export const initialNavigationContentState: NavigationContentState = {
  navigationContent: {
    navigation_content: 'cafelist',
  },
};

// 카페 select id Slice
const navigationContentSlice = createSlice({
  name: 'navigationContent',
  initialState: initialNavigationContentState,
  reducers: {
    setNavigationContent(
      state: NavigationContentState,
      action: PayloadAction<Navigation>
    ) {
      state.navigationContent.navigation_content = action.payload;
    },
  },
});

export const { setNavigationContent } = navigationContentSlice.actions;

export const useNavigationSelector = () =>
  useAppSelector(
    (rootState: RootState) =>
      rootState.navigationContent.navigationContent.navigation_content
  );

export default navigationContentSlice.reducer;
