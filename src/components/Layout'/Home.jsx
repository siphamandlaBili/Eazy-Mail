import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

// Adjusted layout to ensure content starts at the top
const Home = () => {
    // Added log to confirm Home component rendering
    console.log("Home component rendered.");

    return (
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", overflow: "hidden" }}>
            <Sidebar />
            <div style={{ display: "flex", flexDirection: "column", width: "94%", height: "100vh", overflowY: "auto" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Home;