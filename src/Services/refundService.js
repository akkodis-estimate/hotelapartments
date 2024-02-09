import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class RefundService {
  refund_list = (listParams) => {
    return apiClient().get(`${endpoints.booking_review.REFUND_LIST}`, {
      params: { ...listParams },
    });
  };
  get_refund = (booking_sid) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.booking_review.GET_REFUND,[booking_sid])}`
    );
  };
}

var refundService = new RefundService();

export default refundService;
