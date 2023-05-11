import { combineReducers } from 'redux';
import { exampleReducer } from './reducers/example/exampleReducer';
import { courseMenuReducer } from './reducers/menu/menuStateReducer';
import { courseMenuDataLoadReducer } from './reducers/menu/menuDataLoadReducer';
import { userCourseCartReducer } from './reducers/userState/userStateReducer';

export const rootReducer = combineReducers({
  example: exampleReducer,
  courseMenu: courseMenuReducer,
  courseLoad: courseMenuDataLoadReducer,
  userCart: userCourseCartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;