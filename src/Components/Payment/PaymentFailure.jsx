import React from 'react';
import { NavLink } from 'react-bootstrap';

const PaymentFailure = () => {
    return (
        <div className="container p-2 navContainer" align="center">
            <div className="brandLogo">
                <NavLink to="/" className="logoXl">
                    <img src="https://projectservicedapartment.blob.core.windows.net/logos/logo.png" height="50px" alt='' />
                </NavLink>
                <hr />
            </div>

            <div style={{paddingTop: '100px', color: 'red'}}><h1>Oops... Something went wrong, please try again.</h1></div>
            <p style={{paddingTop: '10px'}}><a href="https://project-integ-sa-website.azurewebsites.net/account/bookings">Click here</a> to go back to your booking</p>
        </div >
    );
};

export default PaymentFailure;