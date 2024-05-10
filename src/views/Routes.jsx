import { Routes, Route } from "react-router-dom";
import { PageNotFound } from "./404";
import ProductPage from './price/ProductPage'
import HomePage from "./price/HomePage";
import Contact from "../user/Contact";
import Login from "../user/Login";
import Signup from "../user/Signup";
import VerifyEmail from "../user/VerifyEmail";
import ForgotPassword from "../user/ForgotPassword";
import ResetPassword from "../user/ResetPassword";
import AlertPage from "./alerts/AlertPage";


export const AllRoutes = () => {
 
  return (
    <div className="dark:bg-darkbg">
        <Routes>
            <Route path="" element={<HomePage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="alerts" element={<AlertPage />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verifyemail/:id" element={<VerifyEmail />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="resetpassword/:id" element={<ResetPassword />} />
            
            <Route path="contact" element={<Contact />} />


            <Route path="*" element={<PageNotFound />} />
           
        </Routes>
    </div>
  )
}
