import { NavLink } from "react-router-dom";
import "Pages/Policy/Policy.css"
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { ScrollArea } from "@mantine/core";
import ReservationTerms from "../ReservationTerms/ReservationTerms";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";

const RefundPolicy = (props) => {
  const { t } = useTranslation();
  const [popup, setPopup] = useState(false);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to update the screenWidth state on window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      <div className="ha--PolicyContainer">
        <div className="container">
          <div className="ha--PolicyDes">
            <div className="ha--PolicyDesHeader">
              <div className="sectionTitleDesc">
                <h2>{t("pages.policy.refund_policy.title")}</h2>
              </div>
            </div>

            <div className="ha--PolicyDesContent">
              <div className="policyContent">
                <h4>{t("pages.policy.refund_policy.content12")}</h4>
                <p>
                  {t("pages.policy.refund_policy.content1")}
                </p>

                <p>{t("pages.policy.refund_policy.content2")}</p>

                <p>{t("pages.policy.refund_policy.content3")}</p>

                <p>{t("pages.policy.refund_policy.content4")}</p>

                <h4>{t("pages.policy.refund_policy.content5")}</h4>

                <table className="w-75">
                  <tr>
                    <td>{t("pages.policy.refund_policy.content6")}</td>
                    <td>{t("pages.policy.refund_policy.content13")}</td>
                  </tr>
                  <tr>
                    <td>{t("pages.policy.refund_policy.content7")}</td>
                    <td>{t("pages.policy.refund_policy.content8")} </td>
                  </tr>

                </table>

                <p>*{t("pages.policy.refund_policy.content9")}</p>
                <p>{t("pages.policy.refund_policy.content10")}</p>

                {props.fromPopup ? <span className="cursor-pointer popupLinkTextCust" onClick={() => { setPopup(true) }}>
                  <p>{t("pages.policy.refund_policy.content11")}</p>
                </span>
                  :
                  <NavLink to={RoutePaths.POLICY.RESERVATION_TERMS} className="resrvTermsLink" style={{ width: 'max-content' }} onClick={() => { window.scrollTo(0, 0); }}>
                    <p>{t("pages.policy.refund_policy.content11")}</p>
                  </NavLink>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {screenWidth > ScreenResolutions.Width ?
      <ModalPopup
        show={popup}
        dialogClassName="applicationModal termsAndConditionsModal"
      >
        <div className="modal-header border-0 p-0 mb-4">
          <div className="pageTitle">
            <h2>{t("pages.policy.reservation_terms.title")}</h2>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setPopup(false);
            }}
          ></button>
        </div>
        <ScrollArea h={700}>
          <ReservationTerms/>
        </ScrollArea>
      </ModalPopup>
      :
      <MobileDrawer openDrawer={popup} setopenDrawer={setPopup} title={t("pages.policy.reservation_terms.title")} >
      <div className="termsAndConditionsModal"><ReservationTerms /></div>
    </MobileDrawer>}
    </>
  );
};

export default RefundPolicy;
