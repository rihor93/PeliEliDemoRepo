import { CategoryCourse } from "./menuDataLoadTypes";

export const SET_MENU_STATE = 'SET_MENU_STATE';
export const MENU_GROUP_STATE = 'MENU_GROUP_STATE'
export const MENU_COURSE_STATE = 'MENU_COURSE_STATE'
export type MenuState = typeof MENU_GROUP_STATE | typeof MENU_COURSE_STATE

export interface MenuStateState {
  courseMenuState: MenuState,
  courseMenuCurrent: CategoryCourse | null,
}

interface SetMenuStateAction {
  type: typeof SET_MENU_STATE;
  payload: MenuStateState;
}

export type MenuStateActionTypes = SetMenuStateAction;