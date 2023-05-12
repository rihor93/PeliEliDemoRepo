import { CourseItem } from "./menuDataLoadTypes";

export const ADD_COURSE = 'ADD_COURSE'
export const DELETE_COURSE = 'DELETE_COURSE'
export const APPLE_DISCOUNT = 'APPLE_DISCOUNT'

export type USER_ACTIONS_TYPE = typeof ADD_COURSE | typeof DELETE_COURSE | typeof APPLE_DISCOUNT;

export interface UserCourseCartState {
    cartEmpty: boolean;
    itemsInCart: CourseInCart[];
    allPriceInCart: number;
}

export type CourseInCart = {
    couse: CourseItem,
    quantity: number,
    priceWithDiscount: number,
}

interface SetUserCourseAction {
    type: USER_ACTIONS_TYPE;
    payload: CourseItem;
}

export type UserStateCourseActionTypes = SetUserCourseAction;