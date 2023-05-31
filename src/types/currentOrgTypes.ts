export const SET_CURRENT_ORG = 'SET_CURRENT_ORG'

export type CURRENT_ORG_ACTIONS_TYPE = typeof SET_CURRENT_ORG;

export interface CurruntOrgState {
    curOrg: number;
}


interface OrgAction {
    type: CURRENT_ORG_ACTIONS_TYPE;
    payload: number;
}


export type CurrentOrgActionTypes = OrgAction;
