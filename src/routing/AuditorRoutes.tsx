import {Dashboard} from "@/components/shared/Dashboard";
import PrincipalLayout from "@/layouts/PrincipalLayout";
import { SearchChatRoomPage } from "@/pages/chat/SearchChatRoomPage";
import { RestoreClientPage } from "@/pages/client/RestoreClientPage";
import { SearchClientsPage } from "@/pages/client/SearchClientPage";
import { RestoreDispatcherPage } from "@/pages/dispatcher/RestoreDispatcherPage";
import { SearchDispatcherPage } from "@/pages/dispatcher/SearchDispatcherPage";
import { RestoreInventoryPage } from "@/pages/inventory/RestoreInventoryPage";
import { SearchInventoryPage } from "@/pages/inventory/SearchInventoryPage";
import { RestoreInvoicePage } from "@/pages/invoice/RestoreInvoicePage";
import { SearchInvoicePage } from "@/pages/invoice/SearchInvoicePage";
import { RestoreMovementPage } from "@/pages/movement/RestoreMovementPage";
import { SearchMovementPage } from "@/pages/movement/SearchMovementPage";
import { SearchNotificationPage } from "@/pages/notification/SearchNotificationPage";
import { RestoreOrderPage } from "@/pages/order/RestoreOrderPage";
import { SearchOrderPage } from "@/pages/order/SearchOrderPage";
import { RestoreProductPage } from "@/pages/product/RestoreProductPage";
import { SearchProductPage } from "@/pages/product/SearchProductPage";
import { RestoreUserPage } from "@/pages/user/RestoreUserPage";
import { SearchUserPage } from "@/pages/user/SearchUserPage";
import { RestoreWarehousePage } from "@/pages/warehouse/RestoreWarehousePage";
import { SearchWarehousePage } from "@/pages/warehouse/SearchWarehousePage";
import { Route, Routes } from "react-router-dom";

const AuditorRoutes = () => {
   return (
    <Routes>
      <Route path="/" element={<PrincipalLayout />}>
             <Route index element={<Dashboard />} />
             <Route path="products/search" element={<SearchProductPage />} />
             <Route path="products/restore" element={<RestoreProductPage />} />
             <Route path="inventories/search" element={<SearchInventoryPage />} />
             <Route path="inventories/restore" element={<RestoreInventoryPage />} />
             <Route path="movements/search" element={<SearchMovementPage />} />
             <Route path="movements/restore" element={<RestoreMovementPage />} />
             <Route path="warehouses/search" element={<SearchWarehousePage />} />
             <Route path="warehouses/restore" element={<RestoreWarehousePage />} />
             <Route path="orders/search" element={<SearchOrderPage />} />
             <Route path="orders/restore" element={<RestoreOrderPage />} />
             <Route path="clients/search" element={<SearchClientsPage />} />
             <Route path="clients/restore" element={<RestoreClientPage />} />
             <Route path="dispatchers/search" element={<SearchDispatcherPage />} />
             <Route path="dispatchers/restore" element={<RestoreDispatcherPage />} />
             <Route path="invoices/search" element={<SearchInvoicePage />} />
             <Route path="invoices/restore" element={<RestoreInvoicePage />} />
             <Route path="users/search" element={<SearchUserPage />} />
             <Route path="users/restore" element={<RestoreUserPage />} />
             <Route path="notifications/search" element={<SearchNotificationPage />} />
             <Route path="chat-rooms/search" element={<SearchChatRoomPage />} />
     
           </Route>
    </Routes>
  );
}

export default AuditorRoutes