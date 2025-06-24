/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState, useAppSelector } from '~/store';
import { User } from '~/types/user';

export interface UserState {
  user: User;
}

export const initialUserState: UserState = {
  user: {
    isLoggedIn: false,
    email: '',
    memberId: 0,
    memberName: '',
    profile: '',
    role: '',
  },
};

// 사용자 정보 Slice
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUserData: (state: UserState, { payload }: PayloadAction<User>) => {
      state.user = {
        isLoggedIn: true,
        email: payload.email,
        memberId: payload.memberId,
        memberName: payload.memberName,
        profile: payload.profile,
        role: payload.role,
      };
    },
  },
});

export const { setUserData } = userSlice.actions;

export const useAccessUserSelector = () =>
  useAppSelector((rootState: RootState) => rootState.user.user);

export default userSlice.reducer;
