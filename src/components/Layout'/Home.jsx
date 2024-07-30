import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar"

const Home = () =>{
    return <div style={{display:"flex",flexDirection:"row"}}>
        <Sidebar/>
        <div style={{display:"flex",flexDirection:"row",width:"94%",height:"100vh"}}>
        <Outlet/>
        </div>
    </div>
}

export default Home;