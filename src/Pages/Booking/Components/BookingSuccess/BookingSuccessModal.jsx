import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import paymentService from "Services/PaymentService";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const BookingSuccessModal = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const dispatch = useDispatch(); // For calling Reducers

    const redirectToBookings = () => {
        navigate(`${SetDynamicEndpoint(RoutePaths.ACCOUNT.ACCOUNT_BOOKINGS)}`);
    }

    useEffect(() => {
    }, [])

    return (
        <>
            {/* <div className="modal-header border-0 p-0">
                <button
                    type="button"
                    className="btn-close"
                onClick={() => {
                    props.setSuccessModal(false);
                }}
                ></button>
            </div> */}

            <div className="modal-body p-0">
                <div className="row successModal d-flex flex-column align-items-center justify-content-center w-100">
                    <div className="col-lg-12">
                        <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
                            <div className="otpHeader mb-5">
                                <h2 className="text-center">{t("pages.thankyou_modal.thank_you")}</h2>
                                <p className="text-center">
                                    {t("pages.booking.booking_success.success")}
                                </p>
                            </div>


                            <div className="actionBtn w-100 pt-5">
                                <button type="button" className="AuthBtn homeBtn"
                                    onClick={() => {
                                        redirectToBookings()
                                    }}
                                >
                                    {t("pages.booking.booking_success.view_booking")}
                                </button>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookingSuccessModal;
