import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="px-3 mx-auto">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
