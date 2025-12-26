import TableAvailability from "../components/TableAvailability";
import TableReservationForm from "../components/TableReservationForm";

function TablePage() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">
                    Table Availability
                </h2>
                <TableAvailability />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-4">
                    Book a Table
                </h2>
                <TableReservationForm />
            </div>
        </div>
    );
}

export default TablePage;
