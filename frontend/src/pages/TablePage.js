import TableAvailability from "../components/TableAvailability";
import TableReservationForm from "../components/TableReservationForm";
import "./TablePage.css";

function TablePage() {
    return (
        <div className="table-page">


            <div className="table-section">
                <TableReservationForm />
            </div>
        </div>
    );
}

export default TablePage;
