import maskingActions from "reducers/masking/masking.actions";
import countActions from "./count.actions";
import inboxService from "Services/InboxService";

export const getInboxCount =
  (booking_id = 0) =>
  (dispatch) => {
    // dispatch(maskingActions.showMasking());
    dispatch(countActions.resetInboxCount());
    inboxService
      .get_inbox_customer_read_count(booking_id)
      .then((response) => {
        dispatch(countActions.updateInboxCount(response.data));
      })
      .catch((error) => {
        if (error && error.response) {
          dispatch(countActions.resetInboxCount());
        }
      })
      .finally(() => {
        //return dispatch(maskingActions.hideMasking());
      });
  };
