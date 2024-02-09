import React from 'react';
import { NavLink } from 'react-bootstrap';

const PaymentSuccess = () => {
    return (
        <div className="container p-2 navContainer" align="center">
            <div className="brandLogo">
                <NavLink to="/" className="logoXl">
                    <img src="https://projectservicedapartment.blob.core.windows.net/logos/logo.png" height="50px" alt='' />
                </NavLink>
                <hr />
            </div>

            <div style={{paddingTop: '100px'}}><h1>Thank you for the payment.!</h1></div>
            <p style={{paddingTop: '10px'}}><a href="https://project-integ-sa-website.azurewebsites.net/account/bookings">Click here</a> to view your booking</p>
        </div>
    );
};

export default PaymentSuccess;
