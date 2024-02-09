import { DATE_FORMATS, PAYMENT } from "Constants/Constants";
import { dateFormat } from "Helpers/commonMethodHelper";
import creditHistoryService from "Services/CreditHistory";
import { useCallback, useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import maskingActions from "reducers/masking/masking.actions";
import "Pages/Account/Pages/CreditTransactionHistory/creditTransactionHistory.css"
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import validationHelper from "Helpers/validationHelper";
import { toast } from "react-toastify";

const { useTranslation } = require("react-i18next");
const { useDispatch, useSelector } = require("react-redux");

const LoyaltyPointsHistory = (props) => {

    var list_params = {
        page_number: -1,
        page_size: -1,
        sort_column: "booking_date",
        sort_direction: "desc",
        filters: "",
        search_text: "",
        status: "",
    };

    var metaData = {
        page: -1,
        page_size: -1,
        total_results: 0,
        total_in_progress: 0,
        total_page_num: 0,
    };

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { userDetails } = useSelector((state) => state.customerAuth);

    const [lpHistoryList, setLPHistoryList] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [listParams, setlistParams] = useState(list_params);
    const [meta, setMetaData] = useState(metaData);
    const { isMasked } = useSelector((state) => state.masking);
    const { isLoading } = useSelector((state) => state.customerAuth);
    const [loadingData, setLoadingData] = useState(true);

    const getLoyaltyPointsHistoryList = useCallback(() => {
        var params = { ...list_params };
        dispatch(maskingActions.showMasking());
        creditHistoryService
            .loyalty_points_history_list(userDetails?.customer_sid, params)
            .then((res) => {
                setLPHistoryList(res.data.results.list);
                setMetaData(res.data.meta);
            })
            .finally(() => {
                setLoadingData(false);
                dispatch(maskingActions.hideMasking());
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listParams]);

    useEffect(() => {
        const lp_history_list = setTimeout(() => {
            getLoyaltyPointsHistoryList();
        }, 100);

        return () => {
            clearTimeout(lp_history_list);
        };
    }, [listParams, getLoyaltyPointsHistoryList]);

    useEffect(() => {
        if (lpHistoryList?.length > 0) {
            setDisplayedData(lpHistoryList.slice(0, itemsPerPage));
        } //if(apartmnetList === undefined || apartmnetList == null || apartmnetList?.length <= 0)
        else {
            setDisplayedData([]);
        }
    }, [lpHistoryList, itemsPerPage]);

    // load more data 
    const loadMoreData = () => {
        const nextPageEndIndex = displayedData?.length + itemsPerPage;
        setDisplayedData(lpHistoryList.slice(0, nextPageEndIndex));
    };

    return (
        <>
            {!loadingData && !isMasked && !isLoading ? <>
                {displayedData && displayedData.length > 0 && (

                    <div className="ha--LoyalityPoints ">

                        <div className="">
                            <div className="ha--LoyalityPointsLabel">

                                <label className="paymentLabel">
                                    {t("pages.AccountSettings.loyalty_points_history.total_available")}: <span className="priceColor">{meta?.total_loyalty_points ? meta?.total_loyalty_points : 0} </span>
                                </label>

                                {/* <label className="paymentLabel">
                                    {t("pages.AccountSettings.loyalty_points_history.remaining")}: <span className="priceColor">{displayedData[0]?.existing_credit_limit ? displayedData[0]?.existing_credit_limit : "00.0"} </span>
                                </label> */}

                            </div>

                        </div>


                        <div className="ha--LyalityPointsTable">
                            <div className="bookingTable">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">{t("pages.AccountSettings.loyalty_points_history.booking_no")}</th>
                                            <th scope="col">{t("pages.AccountSettings.loyalty_points_history.booking_date")}</th>
                                            <th scope="col">{t("pages.AccountSettings.loyalty_points_history.used_points")}</th>
                                            <th scope="col">{t("pages.AccountSettings.loyalty_points_history.gained_points")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.booking_number}</td>
                                                <td>{dateFormat(item?.booking_date, DATE_FORMATS.DDMMMYYYY)}</td>
                                                {/* <td style={{ color: item?.transaction_type_id === PAYMENT.CREDIT ? "green" : "red" }}> {item?.credit_or_debit_amount ? validationHelper.formatFloatValue(item?.credit_or_debit_amount) : 0.00}</td> */}
                                                <td style={{ color: "red" }}> {item?.used_loyalty_points}</td>
                                                <td style={{ color: "green" }}>{item?.gained_loyalty_points}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        

                        <div className="">
                            <div className="animateBtn appMainBtn">
                                {displayedData?.length < lpHistoryList?.length && (
                                    <button type="button" className="appBtn" onClick={loadMoreData}>
                                        <span>{t("pages.AccountSettings.booking.load_more")}</span>
                                        {/* <span className="btnIcon">
                                            <BsArrowRight />
                                        </span> */}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                )}
                {displayedData && displayedData.length === 0 && !isMasked && !isLoading && (
                    <div className="row noBookingWarning">
                        <div className="col-lg-12">
                            <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center">
                                <div className="noBookingIcon mb-4">
                                </div>
                                <div className="noBkkingContent text-center">
                                    <h4 className="mb-3">
                                        {!isMasked ? t("common_lables.not_transact") : ''}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
                :
                <><div className="warningBookingContent d-flex flex-column align-items-center justify-content-center text-center">
                    <h4>{t("common_lables.loading")}</h4>
                </div></>
            }
        </>


    );

}

export default LoyaltyPointsHistory