import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import ProtectedRoutes from "./routing/ProtectedRoutes";
import AuthRoutes from "./routing/AuthRoutes";
import AdminRoutes from "./routing/AdminRoutes";
import WarehouseRoutes from "./routing/WarehouseRoutes";
import SellerRoutes from "./routing/SellerRoutes";
import AuditorRoutes from "./routing/AuditorRoutes";
import DispatcherRoutes from "./routing/DispatcherRoutes";
import { Skeleton } from "./components/ui/skeleton";

const roleRedirectMap: Record<string, string> = {
  ROLE_ADMIN: "/admin",
  ROLE_WAREHOUSE: "/warehouse",
  ROLE_SELLER: "/seller",
  ROLE_AUDITOR: "/auditor",
  ROLE_DISPATCHER: "/dispatcher",
};

const App: React.FC = () => {
  const { userRole, isAuthenticated, checkToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      checkToken();
      setIsLoading(false);
    }
    check()
  }, [checkToken]);

  const getRedirectPath = () => {
    if (isAuthenticated && userRole && roleRedirectMap[userRole]) {
      return roleRedirectMap[userRole];
    }
    return "/auth/login";
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth/*" element={<AuthRoutes />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/warehouse/*" element={<WarehouseRoutes />} />
          <Route path="/seller/*" element={<SellerRoutes />} />
          <Route path="/auditor/*" element={<AuditorRoutes />} />
          <Route path="/dispatcher/*" element={<DispatcherRoutes />} />
        </Route>

        <Route path="/*" element={<Navigate to={getRedirectPath()} replace />} />
      </Routes>
    </Router>
  );
};

export default App;