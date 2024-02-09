const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");
const { SetDynamicEndpoint } = require("Helpers/commonMethodHelper");

class CreditHistoryService {
  credit_history_list = (customer_sid, listParams) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.CREDIT_HISTORY.LIST_CREDIT_HISTORY, [
        customer_sid,
      ])}`,
      { params: { ...listParams } }
    );
  };

  add_credit_limit = (creditsid, payload) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.CREDIT_LIMIT.ADD_CREDIT_LIMIT, [
        creditsid,
      ])}`,
      payload
    );
  };

  loyalty_points_history_list = (customer_sid, listParams) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.LOYALTY_POINTS_HISTORY.LIST_LOYALTY_POINTS_HISTORY, [
        customer_sid,
      ])}`,
      { params: { ...listParams } }
    );
  };
}

var creditHistoryService = new CreditHistoryService();

export default creditHistoryService;
