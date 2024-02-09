import { DATE_FORMATS, DEFAULT_CURRENCY, PAYMENT } from "Constants/Constants";
import { dateFormat } from "Helpers/commonMethodHelper";
import creditHistoryService from "Services/CreditHistory";
import { useCallback, useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import maskingActions from "reducers/masking/masking.actions";
import "Pages/Account/Pages/CreditTransactionHistory/creditTransactionHistory.css"
import validationHelper from "Helpers/validationHelper";
import { toast } from "react-toastify";

const { useTranslation } = require("react-i18next");
const { useDispatch, useSelector } = require("react-redux");

const CreditHistory = (props) => {

    const list_params = {
        page_number: -1,
        page_size: -1,
        sort_column: "",
        sort_direction: "",
        filters: "",
        search_text: "",
        status: "",
    };

    const metaData = {
        page: -1,
        page_size: -1,
        total_results: 0,
        total_in_progress: 0,
        total_page_num: 0,
    };

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.customerAuth);

    const [creditHistoryList, setCreditHistoryList] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [listParams, setlistParams] = useState(list_params);
    const [meta, setMetaData] = useState(metaData);

    const  {isMasked}  = useSelector((state) => state.masking);

    const getCreditHistoryList = useCallback(() => {
        let params = { ...list_params };
        dispatch(maskingActions.showMasking());
        creditHistoryService
            .credit_history_list(userDetails?.customer_sid, params)
            .then((res) => {
                setCreditHistoryList(res.data.results.list);
                setMetaData(res.data.meta);
            })
            .finally(() => {
                dispatch(maskingActions.hideMasking());
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listParams]);

    useEffect(() => {
        
        const credit_history_list = setTimeout(() => {
            getCreditHistoryList();
        }, 500);

        return () => {
            clearTimeout(credit_history_list);
        };
    }, [listParams, getCreditHistoryList]);

    useEffect(() => {
        if (creditHistoryList?.length > 0) {
            setDisplayedData(creditHistoryList.slice(0, itemsPerPage));
        } //if(apartmnetList === undefined || apartmnetList == null || apartmnetList?.length <= 0)
        else {
            setDisplayedData([]);
        }
    }, [creditHistoryList, itemsPerPage]);

    // load more data 
    const loadMoreData = () => {
        const nextPageEndIndex = displayedData?.length + itemsPerPage;
        setDisplayedData(creditHistoryList.slice(0, nextPageEndIndex));
    };
   
    return (
        <>
            {displayedData && displayedData.length > 0 ? (

                <div className="row ">

                    <div className="col-lg-12">
                        <div className="d-flex align-items-center gap-3">

                            <label className="paymentLabel">
                                {t("pages.AccountSettings.credit_history.total_available_credit_limit")}: <span className="priceColor">{DEFAULT_CURRENCY + " "}{displayedData[0]?.credit_limit ? displayedData[0]?.credit_limit : "00.0"} </span>
                            </label>

                            <label className="paymentLabel">
                            {t("pages.AccountSettings.credit_history.remaining_credit_limit")}: <span className="priceColor">{DEFAULT_CURRENCY + " "}{displayedData[0]?.existing_credit_limit ? displayedData[0]?.existing_credit_limit : "00.0"} </span>
                            </label>

                            {/* <button
                                type="button"
                                className="appBtn bg-black  disableButton creditLimitBtn"
                                onClick={() => { addCreditLimitPopup() }}
                            >
                                Add Credit Limit
                            </button> */}


                        </div>

                    </div>


                    <div className="col-lg-12 mt-4 mb-5">
                        <div className="bookingTable">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">{t("pages.AccountSettings.credit_history.booking_no")}</th>
                                        <th scope="col">{t("pages.AccountSettings.credit_history.booking_date")}</th>
                                        <th scope="col">{t("pages.AccountSettings.credit_history.credit_debit")}</th>
                                        <th scope="col">{t("pages.AccountSettings.credit_history.payment_type")}</th>
                                        <th scope="col">{t("pages.AccountSettings.credit_history.remarks")}</th>
                                        {/* <th scope="col">Remaining Credit</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.booking_number}</td>
                                            <td>{dateFormat(item?.booking_date, DATE_FORMATS.DDMMMYYYY)}</td>
                                            {/* <td style={{ color: item?.transaction_type_id === PAYMENT.CREDIT ? "green" : "red" }}> {item?.credit_or_debit_amount ? validationHelper.formatFloatValue(item?.credit_or_debit_amount) : 0.00}</td> */}
                                            <td style={{ color: item?.transaction_type_id === PAYMENT.CREDIT ? "green" : "red" }}>{DEFAULT_CURRENCY + " "} {item?.credit_or_debit_amount ? validationHelper.formatFloatValue(item?.credit_or_debit_amount) : 0.00}</td>
                                            <td>{item?.payment_type}</td>
                                            <td>{item?.credit_limit_remarks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="col-lg-8 d-flex justify-content-center pb-5">
                        <div className="animateBtn me-3">
                            {displayedData?.length < creditHistoryList?.length && (
                                <button type="button" className="appBtn" onClick={loadMoreData}>
                                    {t("pages.AccountSettings.booking.load_more")}
                                    <span className="btnIcon">
                                        <BsArrowRight />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            ) :
                (
                    <div className="row noBookingWarning">
                        <div className="col-lg-12">
                            <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center">
                                <div className="noBookingIcon mb-4">
                                </div>
                                <div className="noBkkingContent text-center">
                                    <h4 className="mb-3">
                                        {/* We're sorry! You don't have any credit transaction yet. */}
                                        { !isMasked ? t("common_lables.not_transact") : ''}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </>


    );

}

export default CreditHistory