import { createStore, applyMiddleware } from "redux";
import { createRouterMiddleware } from "@lagunovsky/redux-react-router";
import { persistStore, persistReducer } from "redux-persist";
import { composeWithDevTools } from "@redux-devtools/extension";
import thunk from "redux-thunk";
import { logger } from "redux-logger";
import { createBrowserHistory } from "history";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/rootReducer";

const persistConfig = {
  key: "reducer",
  storage,
  blacklist: ["masking"],
};

const history = createBrowserHistory({
  basename: process.env.PUBLIC_URL,
});
const is_prod = process.env.REACT_APP_PRODUCTION;
let middlewares = JSON.parse(is_prod)
  ? [createRouterMiddleware(history), thunk]
  : [createRouterMiddleware(history), thunk, logger];
const presistedReducer = persistReducer(persistConfig, rootReducer(history));
const store = createStore(
  presistedReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);
const persistor = persistStore(store);

export { history, persistor, store };
