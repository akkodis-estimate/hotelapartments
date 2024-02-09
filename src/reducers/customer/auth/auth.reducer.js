import { actionTypes } from "./auth.actionTypes";
import { initialState } from "./auth.initialState";

const registerReducer = (state, { type, payload }) => {
  if (typeof state === "undefined") {
    return initialState;
  }

  switch (type) {
    case actionTypes.REGISTER_LOADING:
    case actionTypes.LOGIN_LOADING:
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isRegisterSuccess: payload,
        isUserVerified: false,
      };

    case actionTypes.LOGIN_SUCCESS:
      localStorage.setItem("userDetails", JSON.stringify(payload.user));
      localStorage.setItem("token", payload.token);

      return {
        ...state,
        isLoading: false,
        userDetails: payload.user,
        // permissions: [...payload.roles.permissions],
        // properties: payload.properties,
      };

    case actionTypes.REGISTER_ERROR:
    case actionTypes.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
        errorMessage: payload,
      };

    case actionTypes.LOGOUT: {
      localStorage.clear();
      return {
        ...state,
        isLoading: false,
        userDetails: null,
      };
    }

    case actionTypes.UPDATE_USER_DETAILS: {
      localStorage.setItem("userDetails", JSON.stringify(payload));
      // debugger;
      return {
        ...state,
        userDetails: payload,
      };
    }

    case actionTypes.SET_NEW_PASSWORD_LOADING: {
      return {
        ...state,
        isLoading: true,
        errorMessage: null,
      };
    }

    case actionTypes.SET_NEW_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: null,
        userDetails: null,
      };
    }

    case actionTypes.UPDATE_PERMISSIONS: {
      // localStorage.setItem("userDetails", JSON.stringify(payload));
      // debugger;
      return {
        ...state,
        permissions: [...payload],
      };
    }
    case actionTypes.ADD_PROPERTY:
      return {
        ...state,
        properties: [...payload],
      };
    case actionTypes.DELETE_PROPERTY:
      return {
        ...state,
        properties: [...payload],
      };

    case actionTypes.VERIFY_USER:
      return {
        ...state,
        isUserVerified: true,
      };

    case actionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

export default registerReducer;
