import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState, useAppSelector } from '~/store';

export interface Auth {
  access_token: string;
  managed_cafe_id: string;
  member_name: string; // ✅ 타입 정의에도 추가
}

export interface AuthState {
  auth: Auth;
}

const initialAuthState: AuthState = {
  auth: {
    access_token: '',
    managed_cafe_id: '',
    member_name: '',  // ✅ 초기값 추가
  },
};

// 사용자 인증 Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setToken(state: AuthState, { payload }: PayloadAction<Auth>) {
      state.auth.access_token = payload.access_token;
      state.auth.managed_cafe_id = payload.managed_cafe_id ?? '';
      state.auth.member_name = payload.member_name ?? '';  // ✅ 이거 추가
    },
  },
});

export const { setToken } = authSlice.actions;

// ✅ selector들
export const useAccessTokenSelector = () =>
    useAppSelector((rootState: RootState) => rootState.auth.auth.access_token);

export const useManagedCafeIdSelector = () =>
    useAppSelector((rootState: RootState) => rootState.auth.auth.managed_cafe_id);

export const useMemberNameSelector = () =>
    useAppSelector((rootState: RootState) => rootState.auth.auth.member_name);  // ✅ 이거 추가

export default authSlice.reducer;
