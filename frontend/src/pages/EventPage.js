import HallAvailability from "../components/HallAvailability";
import EventBookingForm from "../components/EventBookingForm";
import "./EventPage.css";

function EventPage() {
    return (
        <div className="event-page">
            <div className="event-section">
                <h2>Hall Availability</h2>
                <HallAvailability />
            </div>

            <div className="event-section">
                <EventBookingForm />
            </div>
        </div>
    );
}

export default EventPage;
