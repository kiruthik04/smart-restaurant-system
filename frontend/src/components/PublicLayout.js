import Navbar from "../components/Navbar";
import "./PublicLayout.css";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        {children}
      </div>
    </>
  );
}

export default PublicLayout;
