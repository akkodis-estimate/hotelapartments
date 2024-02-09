import BookingIcon from "Assets/Images/HeaderIcons/BookingIcon";
import InboxIcon from "Assets/Images/HeaderIcons/InboxIcon";
import UserOneIcon from "Assets/Images/HeaderIcons/UserOneIcon";
import { RoutePaths, USER_TYPE } from "Constants/Constants";
import "Pages/Account/account.css";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GrTransaction } from "react-icons/gr";
import { MdCurrencyExchange, MdOutlineLoyalty } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { getInboxCount } from "reducers/count/count.thunks";

const AccountSettings = () => {
  const { t } = useTranslation();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { inbox_count } = useSelector((state) => state.count);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const inbox_count_reducer = setTimeout(() => {
      dispatch(getInboxCount());
    }, 500);

    return () => {
      clearTimeout(inbox_count_reducer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div
      className={`ha--AcountContainer ${
        location.pathname === "/account/inbox" ? "ha--InboxStyleAside" : ""
      }`}
    >
      <div className="ha--AcountSideBar">
        <div className="accountSettingsAside">
          <div className="BIMenu">
            <ul className="BIMenuList">
              <li className="BIMenuListItem">
                <NavLink
                  to="/account/bookings"
                  className="ha--accountsAsideLinks"
                >
                  <div>
                    {" "}
                    <BookingIcon />
                  </div>
                  {t("pages.AccountSettings.bookingstab")}
                </NavLink>
              </li>
              <li className="BIMenuListItem">
                <NavLink
                  to="/account/refund-request"
                  className="ha--accountsAsideLinks"
                >
                  <div>
                    <MdCurrencyExchange size={22} />
                  </div>
                  {t("pages.AccountSettings.refund_request")}
                </NavLink>
              </li>

              {userDetails && userDetails.type == USER_TYPE.CORPORATE_USER && (
                <li className="BIMenuListItem">
                  <NavLink
                    to="/account/credit-history"
                    className="ha--accountsAsideLinks"
                  >
                    <div>
                      {" "}
                      <GrTransaction />
                    </div>
                    {t("pages.AccountSettings.credit_transaction")}
                  </NavLink>
                </li>
              )}
              {userDetails && userDetails.type == USER_TYPE.USER && (
                <li className="BIMenuListItem">
                  <NavLink
                    to={RoutePaths.ACCOUNT.LOYALTY_POINTS_HISTORY}
                    className="ha--accountsAsideLinks"
                  >
                    <div>
                      {" "}
                      <MdOutlineLoyalty size={22} />
                    </div>
                    {t("pages.AccountSettings.loyalty_points")}
                  </NavLink>
                </li>
              )}

              <li className="BIMenuListItem">
                {/* <NavLink to="/account/#" className="d-flex align-items-center"> */}
                <NavLink to="/account/inbox" className="ha--accountsAsideLinks">
                  <div>
                    <InboxIcon />
                  </div>
                  {t("pages.AccountSettings.inbox")} ({inbox_count})
                </NavLink>
                {/* </NavLink> */}
              </li>
            </ul>
            <hr />
            <ul className="BIMenuList">
              <li className="BIMenuListItem">
                <NavLink
                  to="/account/account-settings"
                  className="ha--accountsAsideLinks"
                >
                  <div>
                    <UserOneIcon />
                  </div>
                  {t("pages.AccountSettings.title")}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="ha--MainAside">
        <div className="accountSettingmainContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
