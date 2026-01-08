import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrderSessionId } from "../utils/session";
import api from "../api/axios";
import "./HomePage.css";

// Import local posters
import posterImg1 from "../assests/images/realistic-pizza-background-menu-poster-traditional-italian-food-toppings-restaurant-banner-advertising-vector-d-173434987.jpg";
import posterImg2 from "../assests/images/restaurant-social-media-banner-template-food-menu-posters-for-restaurants-and-cafes-modern-social-media-feed-banner-marketing-on-the-black-background-vector.jpg";

function HomePage() {
  const [posters] = useState([
    { id: 1, imageUrl: posterImg1, title: "Weekend Feast", description: "Get 20% off on all family platters" },
    { id: 2, imageUrl: posterImg2, title: "Happy Hours", description: "Buy 1 Get 1 Free on Mocktails (4PM - 7PM)" },
  ]);

  const [activeOrder, setActiveOrder] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const orderSessionId = getOrderSessionId();

  // Step 3: Define Order Stages
  const orderStages = ["Received", "Preparing", "Ready"];

  useEffect(() => {
    if (orderSessionId) {
      const fetchOrder = () => {
        api.get(`/api/orders/session/${orderSessionId}`)
          .then(res => setActiveOrder(res.data))
          .catch(err => {
            if (err.response && err.response.status === 404) {
              // No active order, this is expected for new users
              setActiveOrder(null);
            } else {
              console.error("Order fetch error", err);
            }
          });
      };

      fetchOrder();
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderSessionId]);

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
            <h3>Live Order Status</h3>
            {activeOrder && <span className="order-id">ID: #{activeOrder.id}</span>}
          </div>

          {activeOrder ? (
            <div className="status-tracker">
              {/* Step 3: Visual Order Timeline */}

              <div className="order-timeline">
                {orderStages.map((stage, index) => {
                  const currentStatusIndex = orderStages.indexOf(activeOrder.status);
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div
                      key={stage}
                      className={`timeline-item ${isCompleted ? "active" : ""} ${isCurrent ? "pulse" : ""}`}
                    >
                      <div className="step-circle">
                        {isCompleted && index < currentStatusIndex ? "✓" : index + 1}
                      </div>
                      <span className="step-label">{stage}</span>
                    </div>
                  );
                })}
              </div>

              <div className="status-footer-info">
                <p className="time-est">
                  Est. Ready: <strong>{activeOrder.estimatedTime || "Processing..."}</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>No active orders found.</p>
              <button className="order-now-btn" onClick={() => window.location.href = '/order'}>Order Food Now</button>
            </div>
          )}
        </section>

        {activeOrder && (
          <section className="real-bill-card">
            <h3>Bill Summary</h3>
            <div className="bill-table">
              {activeOrder.items?.map((item, index) => (
                <div className="bill-item-row" key={index}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="bill-divider"></div>
              <div className="bill-item-row subtotal">
                <span>Subtotal</span>
                <span>₹{activeOrder.subtotal}</span>
              </div>
              <div className="bill-item-row tax">
                <span>Tax (GST 5%)</span>
                <span>₹{activeOrder.tax}</span>
              </div>
              <div className="bill-item-row grand-total">
                <span>Total Amount</span>
                <span>₹{activeOrder.totalAmount}</span>
              </div>
            </div>
          </section>
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