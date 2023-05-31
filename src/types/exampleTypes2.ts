export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'; 
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

export interface ExampleState {
  example: string;
}

interface SetExampleAction {
  type: typeof FETCH_DATA_REQUEST | typeof FETCH_DATA_SUCCESS | typeof FETCH_DATA_FAILURE;
  payload: string;
}

export type Example2ActionTypes = SetExampleAction;