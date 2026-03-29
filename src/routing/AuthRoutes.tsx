
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import PrivacyPolicy from "@/pages/auth/PrivacyPolicy";
import TermsOfService from "@/pages/auth/TermsOfService";
import { Routes, Route } from "react-router-dom";


const AuthRoutes = () => {

    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
            </Route>
        </Routes>
    );
};

export default AuthRoutes;