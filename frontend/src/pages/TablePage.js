import TableAvailability from "../components/TableAvailability";
import TableReservationForm from "../components/TableReservationForm";

function TablePage() {
    return (
        <>
            <div className="card">
                <h2>Table Availability</h2>
                <TableAvailability />
            </div>

            <div className="card">
                <h2>Book a Table</h2>
                <TableReservationForm />
            </div>
        </>
    );
}

export default TablePage;
