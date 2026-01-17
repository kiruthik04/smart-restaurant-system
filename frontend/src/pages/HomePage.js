import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrderSessionId } from "../utils/session";
import api from "../api/axios";
import BillModal from "../components/BillModal"; // Import BillModal
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";
import "./HomePage.css";
import LoadingSpinner from "../components/LoadingSpinner";

// Import local posters
import posterImg1 from "../assests/images/realistic-pizza-background-menu-poster-traditional-italian-food-toppings-restaurant-banner-advertising-vector-d-173434987.jpg";
import posterImg2 from "../assests/images/restaurant-social-media-banner-template-food-menu-posters-for-restaurants-and-cafes-modern-social-media-feed-banner-marketing-on-the-black-background-vector.jpg";

function HomePage() {
  const { user } = useAuth();
  const [posters] = useState([
    { id: 1, imageUrl: posterImg1, title: "Weekend Feast", description: "Get 20% off on all family platters" },
    { id: 2, imageUrl: posterImg2, title: "Happy Hours", description: "Buy 1 Get 1 Free on Mocktails (4PM - 7PM)" },
  ]);

  const [activeOrders, setActiveOrders] = useState([]); // Changed to array
  const [billData, setBillData] = useState(null);
  const [showBill, setShowBill] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const orderSessionId = getOrderSessionId();
  const [loading, setLoading] = useState(true);

  // Step 3: Define Order Stages (Removed unused variable)

  const handleShowBill = async () => {
    if (activeOrders.length === 0) return;
    const tableNumber = activeOrders[0].tableNumber;
    try {
      const res = await api.get(`/api/billing/by-number/${tableNumber}`);
      setBillData(res.data);
      setShowBill(true);
    } catch (err) {
      console.error("Failed to fetch bill", err);
      alert("Could not fetch bill.");
    }
  };

  const handlePayAndRelease = async () => {
    if (!billData) return;
    try {
      // Step 1: Mark all active orders as COMPLETED (Billed) in Backend
      // We iterate because generateBill is per order. 
      // In a real app, you might have a bulk-bill endpoint.
      const orderPromises = activeOrders.map(order =>
        api.put(`/api/orders/${order.orderId}/bill`)
      );
      await Promise.all(orderPromises);

      // Step 2: Release Table
      await releaseTable(billData.tableNumber);

      clearOrderSession();
      setActiveOrders([]);
      setShowBill(false);
      alert("Payment successful! Table released.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to complete payment process.");
    }
  };

  useEffect(() => {
    const fetchOrder = () => {
      let url = null;

      if (user && user.id) {
        url = `/api/orders/user/active/${user.id}`;
      } else if (orderSessionId) {
        url = `/api/orders/session/${orderSessionId}`;
      }

      if (url) {
        api.get(url)
          .then(res => {
            // Normalize response to array
            if (Array.isArray(res.data)) {
              setActiveOrders(res.data);
            } else if (res.data) {
              setActiveOrders([res.data]);
            } else {
              setActiveOrders([]);
            }
          })
          .catch(err => {
            // 404/204 means no active orders
            setActiveOrders([]);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    };



    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderSessionId, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === posters.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [posters.length]);



  return (
    <div className="home-full-wrapper">
      <div className="promo-slider">
        {posters.map((poster, index) => (
          <div key={poster.id} className={`poster-slide ${index === currentSlide ? "active" : ""}`}>
            <img src={poster.imageUrl} alt={poster.title} className="poster-img" />
            <div className="poster-overlay">
              <h2>{poster.title}</h2>
              <p>{poster.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="content-container">
        <section className="live-status-card">
          <div className="section-header">
            <h3>Your Active Orders</h3>
          </div>

          {loading ? (
            <div className="section-loading">
              <LoadingSpinner />
            </div>
          ) : activeOrders.length > 0 ? (
            <>
              <div className="orders-grid">
                {activeOrders.map((order) => {
                  const isReady = order.status === 'READY';
                  return (
                    <div key={order.orderId} className="modern-order-card">
                      <div className="card-header">
                        <span className="order-id">#{order.orderId}</span>
                        <span className={`status-badge-modern ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="table-info">
                          <span className="icon">🍽️</span> Table {order.tableNumber}
                        </div>

                        {/* 3-Segment Progress Bar */}
                        <div className="linear-progress-track">
                          {/* Segment 1: Received */}
                          <div className={`progress-segment seg-received ${["RECEIVED", "PREPARING", "IN_PROGRESS", "READY"].includes(order.status) ? "active loading" : ""
                            }`} title="Received"></div>

                          {/* Segment 2: Preparing */}
                          <div className={`progress-segment seg-preparing ${["PREPARING", "IN_PROGRESS", "READY"].includes(order.status) ? "active loading" : ""
                            }`} title="Preparing"></div>

                          {/* Segment 3: Ready */}
                          <div className={`progress-segment seg-ready ${["READY"].includes(order.status) ? "active completed" : ""
                            }`} title="Ready"></div>
                        </div>

                        <div className="progress-labels">
                          <span>Received</span>
                          <span>Preparing</span>
                          <span>Ready</span>
                        </div>

                        <div className="items-preview-modern">
                          {order.items.slice(0, 3).map(i => (
                            <span key={i.name} className="modern-pill">{i.quantity}x {i.name}</span>
                          ))}
                          {order.items.length > 3 && <span className="more-pill">+{order.items.length - 3} more</span>}
                        </div>
                      </div>

                      <div className="card-footer">
                        <span className="total-label">Total</span>
                        <span className="total-amount">₹{order.totalAmount}</span>
                      </div>

                      {/* Generate Bill Button for Specific Order */}
                      {isReady && (
                        <button
                          className="primary-btn generate-bill-btn"
                          onClick={() => {
                            /* In a real scenario, you might want to confirm specific order or table billing */
                            handleShowBill(order);
                          }}
                          style={{ marginTop: '1rem', width: '100%' }}
                        >
                          Generate Bill & Pay
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No active orders found.</p>
              <button className="order-now-btn" onClick={() => window.location.href = '/order'}>Order Food Now</button>
            </div>
          )}
        </section>

        {/* Bill Modal */}
        {showBill && (
          <BillModal
            bill={billData}
            onClose={() => setShowBill(false)}
            onConvert={handlePayAndRelease}
          />
        )}
      </div>

      <footer className="restaurant-footer">
        <div className="footer-grid">
          <div className="footer-box">
            <h4>📍 Visit Us</h4>
            <p>123 Gourmet Avenue, Food City, 400001</p>
          </div>
          <div className="footer-box">
            <h4>⏰ Opening Hours</h4>
            <p>Mon - Sun: 10:00 AM - 11:00 PM</p>
          </div>
          <div className="footer-box">
            <h4>📞 Contact Support</h4>
            <p>Phone: +91 98765 43210</p>
            <p>Email: hello@smartrestro.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;