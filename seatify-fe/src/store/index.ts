/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import {
  AnyAction,
  CombinedState,
  Reducer,
  configureStore,
} from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import reducers, { ReducerStates } from './reducers';

// configureStore reducer에 담긴 슬라이스들을 하나의 Store 객체로 정리하여 관리해준다.
export const makeStore = () => {
  const store = configureStore({
    reducer: reducers as Reducer<CombinedState<ReducerStates>, AnyAction>,
    devTools: process.env.NODE_ENV === 'development',
  });

  return store;
};

export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

// hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// next-redux-wrapper 라이브러리를 통해 SSR에서 Redux Store에 접근할 수 있음
const wrapper = createWrapper(makeStore);
export default wrapper;
