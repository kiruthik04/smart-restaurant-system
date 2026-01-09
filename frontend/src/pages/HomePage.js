import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrderSessionId } from "../utils/session";
import api from "../api/axios";
import BillModal from "../components/BillModal"; // Import BillModal
import { releaseTable } from "../api/tableApi";
import { clearOrderSession } from "../utils/session";
import "./HomePage.css";

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

  // Step 3: Define Order Stages
  const orderStages = ["Received", "Preparing", "Ready"];

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
      await releaseTable(billData.tableNumber);
      clearOrderSession();
      setActiveOrders([]);
      setShowBill(false);
      alert("Payment successful! Table released.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to release table.");
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
          });
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

          {activeOrders.length > 0 ? (
            <>
              <div className="orders-grid">
                {activeOrders.map((order) => (
                  <div key={order.orderId} className="modern-order-card">
                    <div className="card-header">
                      <span className="order-id">#{order.orderId}</span>
                      <span className={`status-badge-modern ${order.status.toLowerCase()}`}>
                        {order.status}
                        {order.status === 'Preparing' && <span className="pulse-dot"></span>}
                      </span>
                    </div>

                    <div className="card-body">
                      <div className="table-info">
                        <span className="icon">🍽️</span> Table {order.tableNumber}
                      </div>

                      {/* Linear Progress Bar */}
                      <div className="linear-progress-track">
                        {orderStages.map((stage, index) => {
                          const currentStatusIndex = orderStages.indexOf(order.status);
                          const isActive = index <= currentStatusIndex;
                          return (
                            <div
                              key={stage}
                              className={`progress-segment ${isActive ? "filled" : ""}`}
                              title={stage}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="progress-labels">
                        <span>Received</span>
                        <span>Prep</span>
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
                  </div>
                ))}
              </div>

              <div className="dashboard-actions-floating">
                <button
                  className="primary-btn view-bill-btn"
                  onClick={handleShowBill}
                >
                  Generate Bill & Pay
                </button>
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