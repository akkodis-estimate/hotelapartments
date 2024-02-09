import { toast } from "react-toastify";
import authenticationService from "Services/authenticationService";
import { actions } from "./auth.actions";
// import actions from "reducers/customer/auth/auth.actions";

// export const customerRegisterAsync = (userDetails) => (dispatch) => {
//   dispatch(actions.registerCustomerStart());

//   authenticationService
//     .register(userDetails)
//     .then((response) => dispatch(actions.registerCustomerSuccess(response)))
//     .catch((error) => {
//       toast.error(error.response.data.message);
//       dispatch(actions.registerCustomerFailure(error.response.data.message));
//     });
// };

export const userLoginAsync = (model) => (dispatch) => {
  dispatch(actions.loginCustomerStart());
  authenticationService
    .login(model)
    .then((response) => {
      

      if (response.data.user.is_password_updated || response.data.user?.type == 2) {
        toast.success("Login success");
      } else {
        toast.info("Please enter new password");
      }

      return dispatch(actions.loginCustomerSuccess(response.data));
    })
    .catch((error) => {
      if (error && error.response) {
        toast.error(error.response.data.message);
        dispatch(actions.loginCustomerFailure(error.response.data.message));
      }
    });
};

export const userRegisterAsync = (model) => (dispatch) => {
  dispatch(actions.loginCustomerStart());

  authenticationService
    .register_user(model)
    .then((response) => {
      toast.success("User registered successfully.Please verify to continue");
      return dispatch(actions.registerCustomerSuccess(response.data));
    })
    .catch((error) => {
      if (error && error.response) {
        toast.error(error.response.data.message);
        dispatch(actions.registerCustomerFailure(error.response.data.message));
      }
    });
};

// export const userSetNewPassword = (model) => (dispatch) => {
//   dispatch(actions.setNewPasswordStart());
//   authenticationService
//     .set_new_password(model)
//     .then((response) => {


//       toast.success("Password changed Successfully. Please login to continue");

//       return dispatch(actions.setNewPasswordSuccess());
//     })
//     .catch((error) => {
//       if (error && error.response) {
//         toast.error(error.response.data.message);
//         dispatch(actions.loginCustomerFailure(error.response.data.message));
//       }
//     });
// };
