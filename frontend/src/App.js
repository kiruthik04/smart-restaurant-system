import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import EventPage from "./pages/EventPage";
import OrderPage from "./pages/OrderPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminTablePage from "./pages/AdminTablePage";
import AdminOrderPage from "./pages/AdminOrderPage";
import KitchenPage from "./pages/KitchenPage";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="page-wrapper">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tables" element={<TablePage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/order" element={<OrderPage />} />

          {/* ADMIN (no auth for now) */}
          <Route path="/admin/tables" element={<AdminTablePage />} />
          <Route path="/admin/orders" element={<AdminOrderPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* KITCHEN */}
          <Route path="/kitchen" element={<KitchenPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
