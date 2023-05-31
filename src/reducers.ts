import { combineReducers } from 'redux';
import { courseMenuReducer } from './reducers/menuState/menuStateReducer';
import { courseMenuDataLoadReducer } from './reducers/menuData/menuDataLoadReducer';
import { userCourseCartReducer } from './reducers/userState/userStateReducer';
import { currentOrgReducer } from './reducers/currentOrg/currentOrgReducer';

export const rootReducer = combineReducers({
  courseMenu: courseMenuReducer,
  courseLoad: courseMenuDataLoadReducer,
  userCart: userCourseCartReducer,
  userOrg: currentOrgReducer,
});

export type RootState = ReturnType<typeof rootReducer>;