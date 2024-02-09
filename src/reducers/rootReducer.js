import { combineReducers } from "redux";
import { createRouterReducer } from "@lagunovsky/redux-react-router";
import customerAuthReducer from "./customer/auth/auth.reducer";
// import configReducer from './common/config/config.reducer'
import maskingReducer from "./masking/masking.reducer";
import languageReducer from "./LanguageHeader/langHeader.reducer";
import countReducer from "./count/count.reducer";

const rootReducer = (history) =>
  combineReducers({
    router: createRouterReducer(history),
    customerAuth: customerAuthReducer,
    // configs: configReducer,
    masking: maskingReducer,
    language: languageReducer,
    count: countReducer,
  });

export default rootReducer;
