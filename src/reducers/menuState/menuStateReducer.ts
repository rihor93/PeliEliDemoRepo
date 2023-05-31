import React from 'react';
import { CategoryCourse } from '../menuData/menuDataLoadTypes';
import { MENU_COURSE_STATE, MENU_GROUP_STATE, MenuStateActionTypes, MenuStateState, SET_MENU_STATE } from '../../types/menuStateTypes';

const initialState: MenuStateState = {
  courseMenuState: MENU_GROUP_STATE,
  courseMenuCurrent: null,
};

export function courseMenuReducer(state = initialState, action: MenuStateActionTypes): MenuStateState {
  switch (action.type) {
    case SET_MENU_STATE:
      return {
        ...state,
        courseMenuCurrent: action.payload.courseMenuCurrent,
        courseMenuState: action.payload.courseMenuState,
      };
    default:
      return state;
  }
}


export function setCourseMenuStateGroup() {
  return {
    type: SET_MENU_STATE,
    payload: {courseMenuState: MENU_GROUP_STATE, courseMenuVCode: 0},
  };
}

export function setCourseMenuStateCourse(category: CategoryCourse) {
  return {
    type: SET_MENU_STATE,
    payload: {courseMenuState: MENU_COURSE_STATE, courseMenuCurrent: category},
  };
}
