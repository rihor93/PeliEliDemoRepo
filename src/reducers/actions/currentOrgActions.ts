import { SET_CURRENT_ORG } from "../currentOrg/currentOrgTypes";

export function setCurOrg(org: number) {
    return {
      type: SET_CURRENT_ORG,
      payload: org,
    };
  }
  