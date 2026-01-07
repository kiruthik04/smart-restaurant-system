const ServiceButtons = () => {
    const handleRequest = (service) => {
        // api.post("/api/service-requests", { type: service, table: "04" })
        alert(`Request for ${service} sent to staff!`);
    };

    return (
        <div className="service-actions">
            <button onClick={() => handleRequest("Waiter")} className="service-btn">🛎️ Call Waiter</button>
            <button onClick={() => handleRequest("Water")} className="service-btn">💧 Request Water</button>
            <button onClick={() => handleRequest("Bill")} className="service-btn">🧾 Request Final Bill</button>
        </div>
    );
};