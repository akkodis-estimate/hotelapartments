import { Outlet } from "react-router-dom";
import Header from "Components/Header/header";
import Footer from "Components/Footer/footer";


import "./layout.css";
import MenuSidebar from "Components/MenuSidebar/MenuSidebar";
import { useState } from "react";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>

      <div className={`AppContainer ${isOpen ? "showSidebarLeft" : ""}`}>
        <Header isOpen={isOpen} setIsOpen={setIsOpen} />
        <MenuSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="mainContent m-0">
          <Outlet />

        </div>
        <Footer />
      </div>

    </>
  );
};

export default Layout;
