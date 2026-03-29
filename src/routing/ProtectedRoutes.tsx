import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const roleAllowedRoutes: Record<string, string[]> = {
  ROLE_ADMIN: ["/admin"],
  ROLE_WAREHOUSE: ["/warehouse"],
  ROLE_SELLER: ["/seller"],
  ROLE_AUDITOR: ["/auditor"],
  ROLE_DISPATCHER: ["/dispatcher"],
};

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userRole, isAuthenticated, checkToken } = useAuthStore();

  useEffect(() => {
    checkToken();

    if (!isAuthenticated) {
      navigate("/auth/login", { replace: true });
      return;
    }

    if (
      userRole &&
      !roleAllowedRoutes[userRole]?.some((route) =>
        location.pathname.startsWith(route),
      )
    ) {
      const defaultRoute = roleAllowedRoutes[userRole]?.[0] || "/auth/login";
      navigate(defaultRoute, { replace: true });
    }
  }, [userRole, isAuthenticated, navigate, location, checkToken]);

  return <Outlet />;
};

export default ProtectedRoutes;
