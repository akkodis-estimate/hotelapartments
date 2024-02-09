import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthorisedRoute = ({ children, returnURL }) => {
    const { userDetails } = useSelector((state) => state.customerAuth);
    const [hasAccess, setHasAccess] = useState(false);
    const navigate = useNavigate();
    // useEffect(() => {
    //     if (userDetails) {
    //         setHasAccess(true);
    //     }
    // }, []);
    // return (
    //     <>
    //         {/* {hasAccess === false ? (
    //       <Navigate to={RoutePaths.AUTHORISATION.SIGN_IN} replace />
    //     ) : (
    //       children
    //     )} */}

    //         {hasAccess === false ? (
    //             navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
    //                 state: {
    //                   returnPath: `${SetDynamicEndpoint(returnURL)}`,
    //                 },
    //               })
    //         ) : (
    //             children
    //         )}
    //     </>
    // );

    useEffect(() => {
        if (userDetails) {
            setHasAccess(true);
        } else {
            navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
                state: {
                    returnPath: `${SetDynamicEndpoint(returnURL)}`,
                },
            });
        }
    }, [userDetails, navigate, returnURL]);

    return (
        <>
            {hasAccess ? children : null}
        </>
    );
};
export default AuthorisedRoute;
