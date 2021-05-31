import * as ActionType from './action-type';
let defaultState = {
    dataList: []
};
export const authorityList = (state = defaultState, action) => {
    switch(action.type){
        case ActionType.AUTHORITYLIST:
            return {...state, ...action};
        default:
            return state;
    }
};

