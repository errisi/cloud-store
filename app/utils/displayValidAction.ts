import { Files } from "../models/file.model";
import { Action } from "../types/Actions";

export const displayValidAction = (action: Action | null, file: Files) => {
  switch (action) {
    case Action.Share:
      if (!!file && !!file.url) {
        return "Stop sharing";
      } else {
        return action;
      }

    default:
      return action;
  }
};
