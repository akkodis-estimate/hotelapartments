
import PersionalInformation from "./Components/PersonalInformation/PersonalInformation";
import ChangePassword from "./Components/ChangePassword/ChangePassword";
import "Pages/Account/Pages/AccountSettings/accountsettings.css"
import { useTranslation } from "react-i18next";
import { useState } from "react";


const AccountSettings = (props) => {

  const { t } = useTranslation();
  const [isEditPassword, setIsEditPassword] = useState(true);

  return (
    <>

      <ul
        className="nav nav-pills accountStngSmSec ha--PINavPills"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pillsAccount"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            {t("pages.AccountSettings.account")}
          </button>
        </li>

        {isEditPassword && ( 
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pillsPassword"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              {t("pages.AccountSettings.password")}
            </button>
          </li>
        )}

      </ul>

      <div className="tab-content ha--accountTabContent" id="pills-tabContent">

        <div
          className="tab-pane fade show active"
          id="pillsAccount"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
          tabIndex="0"
        >
          <PersionalInformation setIsEditPassword={setIsEditPassword}/>
        </div>

        <div
          className="tab-pane fade"
          id="pillsPassword"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
          tabIndex="0"
        >
          <ChangePassword />
        </div>



      </div>

    </>
  );
};

export default AccountSettings;
