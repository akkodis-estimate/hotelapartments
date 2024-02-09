const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class AuthenticationService {
  login = (user) => {
    return apiClient().post(`${endpoints.authentication.LOGIN}`, user);
  };

  register_user = (model) => {
    return apiClient().post(`${endpoints.authentication.SIGN_UP}`, model);
  };

  verify_otp = (model) => {
    return apiClient().put(`${endpoints.ACCOUNT.VERIFY_OTP}`, model);
  };

  account_verify_otp = (model) => {
    return apiClient().post(`${endpoints.authentication.VERIFY_OTP}`, model);
  };

  google_login = (user) => {
    return apiClient().post(`${endpoints.authentication.GOOGLE_LOGIN}`, user);
  };

  facebook_login = (user) => {
    return apiClient().post(`${endpoints.authentication.FACEBOOK_LOGIN}`, user);
  };

  account_resend_otp = (model) => {
    return apiClient().post(`${endpoints.authentication.RESEND_CODE}`, model);
  };
}

var authenticationService = new AuthenticationService();

export default authenticationService;
