const MobileSuccessMessage = () => {
  return (
    <>
      <div className="row otpMainDes d-flex flex-column align-items-center justify-content-center w-100">
        <div className="col-lg-3">
          <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
            <div className="otpHeader mb-5">
              <h2 className="text-center">Success</h2>
              <p className="text-center">
                Your Account has been successfully created. <br />
              </p>
            </div>
            <div className="actionBtn">
              <button
                type="submit"
                className="AuthBtn"
                // disabled={button ? true : false}
                disabled={false}
                // onClick={handleFormSubmit}
              >
                Start Searching
                {/* {t("pages.login.create_account")} */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSuccessMessage;
