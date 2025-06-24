/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState, useAppSelector } from '~/store';

export interface CafeId {
  cafeId: string;
  commentId: string;
}

export interface CafeIdState {
  cafeId: CafeId;
}

export const initialCafeIdState: CafeIdState = {
  cafeId: {
    cafeId: '',
    commentId: '',
  },
};

// 카페 select id Slice
const cafeIdSlice = createSlice({
  name: 'cafeId',
  initialState: initialCafeIdState,
  reducers: {
    setCafeId(state: CafeIdState, { payload }: PayloadAction<CafeId>) {
      state.cafeId.cafeId = payload.cafeId;
      state.cafeId.commentId = payload.commentId;
    },
    resetCafeId(state) {
      state.cafeId = { cafeId: '', commentId: '' };
    },
  },
});

export const { setCafeId } = cafeIdSlice.actions;

export const useCafeIdSelector = () =>
  useAppSelector((rootState: RootState) => rootState.cafeId.cafeId);

export default cafeIdSlice.reducer;
