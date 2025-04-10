import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
// import Footer from "./Footer";

const Layout = () => {
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "pl-20" : "pl-72"
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 pt-20">
          <Outlet />
        </main>
        {/* <Footer simplified /> */}
      </div>
    </div>
  );
};

export default Layout;
