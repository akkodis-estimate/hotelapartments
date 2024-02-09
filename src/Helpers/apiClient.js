import axios from "axios";
import { environment } from "../environment";
import authHeader from "../Services/authHeader";
import { toast } from "react-toastify";

import { RoutePaths } from "Constants/Constants";

let isRedirectingToSignIn = false;

const apiClient = (responseType, currency) => {
  // const { REACT_APP_API_URL} = process.env
  const base_url = environment.react_base_url;
  const axiosInstance = axios.create({
    baseURL: base_url,
    headers: authHeader(currency),
    responseType: responseType || "json",
  });
  axiosInstance.interceptors.response.use(
    (response) =>
      new Promise((resolve) => {
        resolve(response);
      }),
    (error) => {
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }
      if (error.response.status === 500) {
        toast.error(error.response.data.message);
        // if (error?.config?.url !== apiEndPoints.dropdown.COMMON) {
        //   // Redirect to error page
        //   // window.location = `${PUBLIC_URL}/error`

        // } else {
        //   // showDangerToast({
        //   //     title: 'An error occurred to load configs!',
        //   //     message: 'Please try again or Contact System Administrator if the problem persists',
        //   // })
        // }
      }
        if (error.response.status === 401 && !isRedirectingToSignIn) {
          isRedirectingToSignIn = true; // Set the flag to true
        // Remove all localstarage & redirect to login page
        // localStorage.clear();
        // window.location = REACT_APP_SIGN_IN_URL
        //localStorage.clear();
        // let login_url = window.location.origin + RoutePaths.AUTHORISATION.SIGN_IN;
        //   window.history.pushState(
        //   { message: error.response.data.message },
        //   "",
        //   RoutePaths.AUTHORISATION.SIGN_IN
        // );
        
        localStorage.clear();
        const currentPath = window.location.pathname;
        if (currentPath !== RoutePaths.AUTHORISATION.SIGN_IN) {
          window.location.href = RoutePaths.AUTHORISATION.SIGN_IN;
        }
      }
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }
  );
  return axiosInstance;
};
export default apiClient;
