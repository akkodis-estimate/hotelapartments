import { LanguageActionTypes } from "./langHeader.actionTypes";
import { languageInitialState } from "./langHeader.initialState";

const configReducer = (state, { type, payload }) => {
  if (typeof state === "undefined") {
    return languageInitialState;
  }

  switch (type) {
    case LanguageActionTypes.SET_LANGUAGE:
      
      return {
        ...state,
        language: payload,
      };

    case LanguageActionTypes.SET_CURRENCY:
      
      return {
        ...state,
        currency_code: payload,
      };

    default:
      return state;
  }
};

export default configReducer;
