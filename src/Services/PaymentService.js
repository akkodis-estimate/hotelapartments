import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class PaymentService {
    payment_request_create = (request_body) => {
        return apiClient().post(
          `${SetDynamicEndpoint(endpoints.PAYMENT.REQUEST_PAYMENT)}`,
          request_body
        );
      };

      payment_success = (request_body) => {
        return apiClient().post(
          `${SetDynamicEndpoint(endpoints.PAYMENT.REQUEST_PAYMENT)}`,
          request_body
        );
      };
}

var paymentService = new PaymentService();
export default paymentService;