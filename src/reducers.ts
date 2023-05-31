import { combineReducers } from 'redux';
import { courseMenuReducer } from './reducers/menuState/menuStateReducer';
import { courseMenuDataLoadReducer } from './reducers/menuData/menuDataLoadReducer';
import { userCourseCartReducer } from './reducers/userCart/userCartReducer';
import { currentOrgReducer } from './reducers/currentOrg/currentOrgReducer';
import { userInfoReducer } from './reducers/userInfo/userInfoReducer';
import { orgDataLoadReducer } from './reducers/organization/organizationReducer';

export const rootReducer = combineReducers({
  courseMenu: courseMenuReducer,
  courseLoad: courseMenuDataLoadReducer,
  userCart: userCourseCartReducer,
  userOrg: currentOrgReducer,
  userInfo: userInfoReducer,
  orgDatas: orgDataLoadReducer,
});

export type RootState = ReturnType<typeof rootReducer>;