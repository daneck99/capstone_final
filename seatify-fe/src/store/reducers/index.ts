/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { combineReducers, AnyAction } from 'redux';
import { HYDRATE } from 'next-redux-wrapper';

import authSlice, { AuthState } from './authSlice';
import userSlice, { UserState } from './userSlice';
import cafeIdSlice, { CafeIdState } from './cafeIdSlice';
import navigationContentSlice, {
  NavigationContentState,
} from './navigateSlice';
import mapSlice, { MapState } from './mapSlice';

export interface ReducerStates {
  auth: AuthState;
  user: UserState;
  cafeId: CafeIdState;
  navigationContent: NavigationContentState;
  map: MapState;
}

// 쪼개져있는 reducer들을 하나로 합쳐준다.
const combinedReducer = combineReducers<ReducerStates>({
  auth: authSlice,
  user: userSlice,
  cafeId: cafeIdSlice,
  navigationContent: navigationContentSlice,
  map: mapSlice,
});

// 서버에서 생성한 스토어의 상태를 HYDRATE라는 액션을 통해서 클라이언트에 합쳐주는 작업
const reducers = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    return { ...state, ...action.payload };
  }

  return combinedReducer(state, action);
};

export default reducers;
