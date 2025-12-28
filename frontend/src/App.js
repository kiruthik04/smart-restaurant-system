import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import EventPage from "./pages/EventPage";
import OrderPage from "./pages/OrderPage";
import AdminTablePage from "./pages/AdminTablePage";
import AdminOrderPage from "./pages/AdminOrderPage";
import KitchenPage from "./pages/KitchenPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/tables" element={<TablePage />} />
          <Route path="/events" element={<EventPage />} />

          <Route path="/admin/tables" element={<AdminTablePage />} />
          <Route path="/admin/orders" element={<AdminOrderPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
        </Routes>
      </div>

    </BrowserRouter>


  );
}

export default App;
