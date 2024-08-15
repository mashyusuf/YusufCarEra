import { Outlet } from "react-router-dom";
import Navbar from "../page/Home/shared/Navbar";
import Footer from "../page/Home/shared/Footer";

const Main = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className='pt-28 min-h-[calc(100vh-68px)]'>
        <Outlet />
      </div>
            <Footer></Footer>
        </div>
    );
};

export default Main;