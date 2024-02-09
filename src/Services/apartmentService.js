import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class ApartmentService {
  apartmentDetails = (apartment_sid, listParams) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.PROPERTIES.PROPERTIES_DETAIL, [apartment_sid])}`, { params: { ...listParams } }
    );
  };

  getBookingPrice = (apartment_sid, request_body) => {
    return apiClient().post(`${SetDynamicEndpoint(endpoints.BOOKING.GET_BOOKING_PRICE, [apartment_sid])}`, request_body);
  }

  updateGuestDetails = (apartment_sid, request_body) => {
    return apiClient().put(
      `${SetDynamicEndpoint(endpoints.PROPERTIES.UPDATE_GUEST_DETAILS, [
        apartment_sid,
      ])}`,
      request_body
    );
  };
}
var apartmentService = new ApartmentService();
export default apartmentService;