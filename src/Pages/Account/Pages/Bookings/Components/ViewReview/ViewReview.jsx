import moment from "moment";
import "./viewreview.css"

const ViewReview = (props) => {
  return (
    <>
      <div className="modal-header border-0 p-0">
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            props.setViewReview({
              show: false,
              data: {},
            });
          }}
        ></button>
      </div>

      <div className="row successModal  d-flex flex-column align-items-center justify-content-center w-100">
        <div className="col-lg-12">
          <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
            <div className="viewReviewTitle">

              <h2 className="text-center">{props.data ? props.data.customerName : ""}</h2>
              <p className="text-center">
                {props.data ? moment(props.data.reviewDate).format('MMMM Do YYYY, h:mm:ss a') : ""}
              </p>
            </div>
            <div className="reviewPara text-center">
              <p>{props.data ? props.data.review : ""}</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReview;