import EventBookingForm from "../components/EventBookingForm";
import "./EventPage.css";

function EventPage() {
    return (
        <div className="event-page">
            <div className="event-section">
                <EventBookingForm />
            </div>
        </div>
    );
}

export default EventPage;
