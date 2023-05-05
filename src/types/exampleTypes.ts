export const SET_EXAMPLE = 'SET_EXAMPLE';

export interface ExampleState {
  example: string;
}

interface SetExampleAction {
  type: typeof SET_EXAMPLE;
  payload: string;
}

export type ExampleActionTypes = SetExampleAction;