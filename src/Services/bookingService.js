import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class BookingService {
  getBookingDetails = (apartment_sid, request_body) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.BOOKING.GET_BOOKING_DETAILS, [
        apartment_sid,
      ])}`,
      request_body
    );
  };

  booking_request_create = (request_body, currency='') => {
    return apiClient('',currency).post(
      `${SetDynamicEndpoint(endpoints.BOOKING.CREATE_BOOKING)}`,
      request_body
    );
  };

  add_to_booking_cart = (request_body) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.BOOKING.ADD_TO_BOOKING_CART)}`,
      request_body
    );
  };

  booking_cart_list = (listParams) => {
    return apiClient().get(`${endpoints.BOOKING.BOOKING_CART_LIST}`, {
      params: { ...listParams },
    });
  };

  remove_from_booking_cart = (request_body, sid) => {
    return apiClient().put(
      `${SetDynamicEndpoint(endpoints.BOOKING.REMOVE_CART_ITEM, [sid])}`,
      request_body
    );
  };

  confirm_booking_cart_items = (request_body, currency = '') => {
    return apiClient('', currency).post(
      `${SetDynamicEndpoint(endpoints.BOOKING.CONFIRM_BOOKING_CART_ITEM)}`,
      request_body
    );
  };

  get_booking_detail_by_customer_id = (request_body) => {
    return apiClient().post(
      `${SetDynamicEndpoint(
        endpoints.BOOKING.GET_BOOKING_DETAIL_BY_CUSTOMER_ID
      )}`,
      request_body
    );
  };
  booking_modification_create = (booking_sid, request_body) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.BOOKING.CREATE_BOOKING_MODIFICATON, [
        booking_sid,
      ])}`,
      request_body
    );
  };

  PAYMENT_BOOKING_LIST = (booking_sid) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.BOOKING.PAYMENT_BOOKING_LIST, [
        booking_sid,
      ])}`
    );
  };

  RE_PAYMENT = (booking_sid) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.REPAYMENT.REPAYMENT_DATA, [booking_sid])}`
    );
  };

  RE_PAYMENT_UPDATE = (booking_sid, request_body) => {
    return apiClient().put(
      `${SetDynamicEndpoint(endpoints.REPAYMENT.REPAYMENT_DATA, [
        booking_sid,
      ])}`,
      request_body
    );
  };

  update_billing_address = (payload) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.BOOKING.UPDATE_BILLING_ADDRESS)}`,
      payload
    );
  };
}
var bookingService = new BookingService();
export default bookingService;
