const SuccessModalPopup = (props, ShowButton) => {
  return (
    <>
      <div className="modal-header border-0 p-0 w-100">
        {props.false ? (
          <>{/* Render props.false content here */}</>
        ) : (
          <>
            <div className="modal-header border-0 p-0">
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  props.setSuccessModal(false);
                }}
              ></button>
            </div>
          </>
        )}
      </div>

      <div className="modal-body p-0">
        <div className="row successModal d-flex flex-column align-items-center justify-content-center w-100">
          <div className="col-lg-12">
            <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
              <div className="otpHeader mb-5">
                <h2 className="text-center">{props.Title}</h2>
                <p className="text-center">{props.Message}</p>
              </div>

              {ShowButton === true ? (
                <div className="actionBtn w-100 pt-5">
                  <button
                    type="button"
                    className="AuthBtn homeBtn"
                    onClick={() => {
                      props.setSuccessModal(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessModalPopup;
