const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class ReviewService {
  booking_list = (listParams) => {
    return apiClient().get(`${endpoints.booking_review.LIST}`, {
      params: { ...listParams },
    });
  };
  review_create = (review_request_body) => {
    return apiClient().post(
      `${endpoints.booking_review.CREATE_REVIEW}`,
      review_request_body
    );
  };
  refund_create = (refund_request_body) => {
    return apiClient().post(
      `${endpoints.booking_review.CREATE_REFUND}`,
      refund_request_body
    );
  };
  get_refund = (booking_sid) => {
    return apiClient().get(
      `${endpoints.booking_review.GET_REFUND}/${booking_sid}`
    );
  };
  get_currency_dropdown = () => {
    return apiClient().get(
      `${endpoints.booking_review.GET_CURRENCY_DROPDOWN}`
    );
  };
}

var reviewService = new ReviewService();

export default reviewService;
