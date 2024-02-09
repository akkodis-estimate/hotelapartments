const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");
const { SetDynamicEndpoint } = require("Helpers/commonMethodHelper");

class AuthCustomers {
  forget_password_verify = (number) => {
    return apiClient().post(
      `${endpoints.FORGET_PASSWORD.FORGET_CODE_VERIFY}`,
      number
    );
  };

  change_password_verify = (number) => {
    return apiClient().post(
      `${endpoints.FORGET_PASSWORD.FORGET_CHANGE_CODE}`,
      number
    );
  };

  reset_customer_password = (model) => {
    return apiClient().post(
      `${endpoints.authentication.RESET_CUSTOMER_CODE}`,
      model
    );
  };

  verify_customer_token = (model) => {
    // debugger;
    return apiClient().post(`${endpoints.authentication.VERIFY_CUSTOMER_TOKEN}`, model);
  };
}

var authCustomers = new AuthCustomers();

export default authCustomers;
