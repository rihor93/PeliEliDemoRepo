import { CourseItem } from '../../types/menuDataLoadTypes';
import { ADD_COURSE, APPLE_DISCOUNT, CourseInCart, DELETE_COURSE, UserCourseCartState, UserStateCourseActionTypes } from '../../types/userStateCourseTypes';

const initialState: UserCourseCartState = {
    cartEmpty: false,
    itemsInCart: [] as CourseInCart[],
    allPriceInCart: 0,
};

export const userCourseCartReducer = (state = initialState, action: UserStateCourseActionTypes): UserCourseCartState => {
    switch (action.type) {
        case ADD_COURSE:
            let course_add: CourseInCart | undefined;
            course_add = state.itemsInCart.find(a => a.couse.VCode === action.payload.VCode)
            if (course_add !== null && course_add !== undefined) {
                course_add.quantity++;
                return applyDicountsAndCoursePrivate({
                    ...state,
                    itemsInCart: state.itemsInCart.map(a => a.couse.VCode == action.payload.VCode ? (course_add as CourseInCart) : a),
                });
                return {
                    ...state,
                    itemsInCart: state.itemsInCart.map(a => a.couse.VCode == action.payload.VCode ? (course_add as CourseInCart) : a),
                };
            }

            return applyDicountsAndCoursePrivate({
                ...state,
                itemsInCart: [...state.itemsInCart, { couse: action.payload, quantity: 1 }],
            });
        case DELETE_COURSE:
            let course: CourseInCart | undefined;
            course = state.itemsInCart.find(a => a.couse.VCode === action.payload.VCode)
            if (course !== null && course !== undefined) {
                if (course.quantity > 1) {
                    course.quantity--;

                    return {
                        ...state,
                        itemsInCart: state.itemsInCart.map(a => a.couse.VCode == action.payload.VCode ? (course as CourseInCart) : a),
                    };
                }
                else {
                    return {
                        ...state,
                        itemsInCart: state.itemsInCart.filter(a => a.couse.VCode != action.payload.VCode),
                    };
                }
            }
            return state;
        default:
            return state;
            
    }
};

function applyDicountsAndCoursePrivate(state: UserCourseCartState): UserCourseCartState {
    let new_state = {...state}
    let summ: number;
    summ = 0;
    state.itemsInCart.forEach(a => summ += summ + a.couse.Price * a.quantity);
    new_state.allPriceInCart = summ;
    return new_state;
}

export function addCourseToCart(couse: CourseItem) {
    return {
        type: ADD_COURSE,
        payload: couse,
    };
}

export function dropCourseFromCart(couse: CourseItem) {
    return {
        type: DELETE_COURSE,
        payload: couse,
    };
}

