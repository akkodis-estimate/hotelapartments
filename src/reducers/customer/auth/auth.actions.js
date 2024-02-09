import { actionTypes } from "./auth.actionTypes";

const registerCustomerStart = () => ({
  type: actionTypes.REGISTER_LOADING,
});

const registerCustomerSuccess = (data) => ({
  type: actionTypes.REGISTER_SUCCESS,
  payload: data,
});

const registerCustomerFailure = (errorMessage) => ({
  type: actionTypes.REGISTER_ERROR,
  payload: errorMessage,
});

const loginCustomerStart = () => ({
  type: actionTypes.LOGIN_LOADING,
});

const loginCustomerSuccess = (data) => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: data,
});

const loginCustomerFailure = (errorMessage) => ({
  type: actionTypes.LOGIN_ERROR,
  payload: errorMessage,
});

const logoutUser = () => ({
  type: actionTypes.LOGOUT,
});

const resetState = () => ({
  type: actionTypes.RESET_STATE,
});

const updateUserDetails = (userDetails) => ({
  type: actionTypes.UPDATE_USER_DETAILS,
  payload: userDetails,
});

const setNewPasswordStart = () => ({
  type: actionTypes.SET_NEW_PASSWORD_LOADING,
});

const setNewPasswordSuccess = () => ({
  type: actionTypes.SET_NEW_PASSWORD_SUCCESS,
});

const updatePermissions = (permissions) => ({
  type: actionTypes.UPDATE_PERMISSIONS,
  payload: [...permissions],
});

const addNewPropertySuccess = (properties_list) => ({
  type: actionTypes.ADD_PROPERTY,
  payload: properties_list,
});

const deletePropertySuccess = (properties_list) => ({
  type: actionTypes.DELETE_PROPERTY,
  payload: properties_list,
});

const verifyUserSuccess = () => ({
  type: actionTypes.VERIFY_USER,
});

export const actions = {
  registerCustomerStart,
  registerCustomerSuccess,
  registerCustomerFailure,
  loginCustomerStart,
  loginCustomerSuccess,
  loginCustomerFailure,
  logoutUser,
  resetState,
  updateUserDetails,
  setNewPasswordStart,
  setNewPasswordSuccess,
  updatePermissions,
  addNewPropertySuccess,
  deletePropertySuccess,
  verifyUserSuccess,
};
