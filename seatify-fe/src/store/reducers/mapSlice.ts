// store/reducers/mapSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '~/store';

export interface MapState {
  isInitialized: boolean;
}

const initialState: MapState = {
  isInitialized: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setInitialized } = mapSlice.actions;

export const selectIsMapInitialized = (state: RootState) =>
  state.isInitialized;

export default mapSlice.reducer;
