import { Outlet } from "react-router-dom"
import Sidebar from "../Sidebar"

const Home = () =>{
    return <div style={{display:"flex",flexDirection:"row",overflow:"hidden"}}>
        <Sidebar/>
        <div style={{display:"flex",flexDirection:"row",width:"94%",height:"100vh",overflow:"scroll"}}>
        <Outlet/>
        </div>
    </div>
}

export default Home;