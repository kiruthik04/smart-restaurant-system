import "./KitchenLayout.css";

function KitchenLayout({ children }) {
  return (
    <div className="kitchen-layout">
      <header className="kitchen-header">
        Kitchen Dashboard
      </header>

      <main className="kitchen-content">
        {children}
      </main>
    </div>
  );
}

export default KitchenLayout;
