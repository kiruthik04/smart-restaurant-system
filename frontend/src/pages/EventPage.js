import HallAvailability from "../components/HallAvailability";
import EventBookingForm from "../components/EventBookingForm";

function EventPage() {
    return (
        <>
            <div className="card">
                <h2>Hall Availability</h2>
                <HallAvailability />
            </div>

            <div className="card">
                <h2>Book an Event</h2>
                <EventBookingForm />
            </div>
        </>
    );
}


export default EventPage;
