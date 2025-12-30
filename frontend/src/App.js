import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import EventPage from "./pages/EventPage";
import OrderPage from "./pages/OrderPage";
import AdminTablePage from "./pages/AdminTablePage";
import AdminOrderPage from "./pages/AdminOrderPage";
import KitchenPage from "./pages/KitchenPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/tables" element={<TablePage />} />
          <Route path="/events" element={<EventPage />} />

          {/* CUSTOMER */}
          <Route
            path="/order"
            element={
              <ProtectedRoute role="CUSTOMER">
                <OrderPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/tables"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminTablePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminOrderPage />
              </ProtectedRoute>
            }
          />

          {/* KITCHEN */}
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute role="KITCHEN">
                <KitchenPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
