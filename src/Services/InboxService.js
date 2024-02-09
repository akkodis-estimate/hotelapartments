import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class InboxService {
  get_inbox_customer = (listParams) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.INBOX.GET_INBOX_MESSAGE)}`,
      { params: listParams }
    );
  };

  post_inbox_customer = (request_body) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.INBOX.POST_INBOX_MESSAGE)}`,
      request_body
    );
  };

  post_inbox_customer_read = (booking_id) => {
    return apiClient().post(
      `${SetDynamicEndpoint(endpoints.INBOX.POST_INBOX_MESSAGE_READ, [
        Number(booking_id),
      ])}`
    );
  };

  get_inbox_customer_read_count = (booking_id) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.INBOX.POST_INBOX_MESSAGE_READ_COUNT)}`,
      { params: { booking_id: booking_id } }
    );
  };

  get_inbox_customer_by_id = (id) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.INBOX.GET_MESSAGES_BY_ID, [id])}`
    );
  };
}

var inboxService = new InboxService();
export default inboxService;
