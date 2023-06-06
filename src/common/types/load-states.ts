export const LoadStates = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type LoadStatesType = typeof LoadStates[keyof typeof LoadStates];
