import HallAvailability from "../components/HallAvailability";
import EventBookingForm from "../components/EventBookingForm";

function EventPage() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">
                    Hall Availability
                </h2>
                <HallAvailability />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">
                    Book an Event
                </h2>
                <EventBookingForm />
            </div>
        </div>
    );
}



export default EventPage;
