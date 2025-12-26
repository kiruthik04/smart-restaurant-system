import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import TablePage from "./pages/TablePage";
import EventPage from "./pages/EventPage";
import OrderPage from "./pages/OrderPage";

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
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
