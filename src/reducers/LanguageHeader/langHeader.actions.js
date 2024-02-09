import { LanguageActionTypes } from "./langHeader.actionTypes";

const setLanguage = (data) => ({
  type: LanguageActionTypes.SET_LANGUAGE,
  payload: data,
});

const setCurrency = (data) => ({
  type: LanguageActionTypes.SET_CURRENCY,
  payload: data,
});

export default {
  setLanguage,
  setCurrency,
};
