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
import AdminStaffPage from "./pages/AdminStaffPage";
import AddMenuPage from "./pages/AddMenuPage";
import KitchenPage from "./pages/KitchenPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/global.css";

import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import KitchenLayout from "./components/KitchenLayout";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="page-wrapper">
          <Routes>
            {/* PUBLIC */}
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/tables" element={<PublicLayout><TablePage /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><EventPage /></PublicLayout>} />
            <Route path="/order" element={<PublicLayout><OrderPage /></PublicLayout>} />

            {/* ADMIN (Protected) */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminDashboardPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/tables" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminTablePage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminOrderPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/kitchen" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminKitchenPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminEventPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/menu" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminMenuPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/menu/add" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AddMenuPage /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/staff" element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout><AdminStaffPage /></AdminLayout>
              </ProtectedRoute>
            } />

            {/* KITCHEN (Protected) */}
            <Route path="/kitchen" element={
              <ProtectedRoute roles={['KITCHEN', 'ADMIN']}>
                <KitchenLayout><KitchenPage /></KitchenLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
