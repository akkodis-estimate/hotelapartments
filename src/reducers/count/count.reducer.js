import countActionTypes from "./count.actionTypes";

const initialState = {
  inbox_count: 0,
};

const countReducer = (state, { type, payload }) => {
	
  if (typeof state === "undefined") {
    return initialState;
  }

  switch (type) {
    case countActionTypes.UPDATE_INBOX_COUNT:
		// debugger
      return {
        ...initialState,
        inbox_count: payload,
      };

    case countActionTypes.RESET_INBOX_COUNT:
      return {
        ...initialState,
        inbox_count: 0,
      };

    default:
      return state;
  }
};

export default countReducer;
