export const FETCH_DATA_REQUEST = 'ORG_DATA_FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'ORG_FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAILURE = 'ORG_FETCH_DATA_FAILURE'

export type FETCH_DATA = typeof FETCH_DATA_REQUEST | typeof FETCH_DATA_SUCCESS | typeof FETCH_DATA_FAILURE;

export type OrgData = {
    Id: number,
    Name: string,
    isCK: number,
}


export type OrgDatas = OrgData[];

export interface OrgDataLoadState {
    loading: boolean;
    data: OrgDatas;
    error: string;
}

interface SetOrgDataAction {
    type: FETCH_DATA;
    payload: OrgDataLoadState;
}

export type OrgDataLoadActionTypes = SetOrgDataAction;