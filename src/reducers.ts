import { combineReducers } from 'redux';
import { exampleReducer } from './reducers/example/exampleReducer';
import { courseMenuReducer } from './reducers/menu/menuStateReducer';
import { courseMenuDataLoadReducer } from './reducers/menu/menuDataLoadReducer';

export const rootReducer = combineReducers({
  example: exampleReducer,
  courseMenu: courseMenuReducer,
  courseLoad: courseMenuDataLoadReducer,

});

export type RootState = ReturnType<typeof rootReducer>;