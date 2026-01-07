import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import EventPage from "./pages/EventPage";
import OrderPage from "./pages/OrderPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminTablePage from "./pages/AdminTablePage";
import AdminOrderPage from "./pages/AdminOrderPage";
import AdminKitchenPage from "./pages/AdminKitchenPage";
import AdminEventPage from "./pages/AdminEventPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import AddMenuPage from "./pages/AddMenuPage";
import KitchenPage from "./pages/KitchenPage";
import "./styles/global.css";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import KitchenLayout from "./components/KitchenLayout";

function App() {
  return (
    <BrowserRouter>


      <div className="page-wrapper">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/tables" element={<PublicLayout><TablePage /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><EventPage /></PublicLayout>} />
          <Route path="/order" element={<PublicLayout><OrderPage /></PublicLayout>} />

          {/* ADMIN (no auth for now) */}
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/tables" element={<AdminLayout><AdminTablePage /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrderPage /></AdminLayout>} />
          <Route path="/admin/kitchen" element={<AdminLayout><AdminKitchenPage /></AdminLayout>} />
          <Route path="/admin/events" element={<AdminLayout><AdminEventPage /></AdminLayout>} />
          <Route path="/admin/menu" element={<AdminLayout><AdminMenuPage /></AdminLayout>} />
          <Route path="/admin/menu/add" element={<AdminLayout><AddMenuPage /></AdminLayout>} />



          {/* KITCHEN */}
          <Route path="/kitchen" element={<KitchenLayout><KitchenPage /></KitchenLayout>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
