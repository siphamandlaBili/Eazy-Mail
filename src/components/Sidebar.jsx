import { CaretLeft, HouseSimple, CalendarBlank, FileText, SignOut } from '@phosphor-icons/react';
import './sidebar.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Ensure correct import paths
import { doc, getDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [activeItem, setActiveItem] = useState('writeEmail');
  const [details, setDetails] = useState({});

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const handleItemClick = (item, route) => {
    setActiveItem(item);
    navigate(route);
  };

  const fetchUserData = async (user) => {
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDetails(docSnap.data());
      }
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        navigate('/'); // Redirect to home or login page if user is not logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      toast.error("Cannot log out 🥲: " + error.message);
    }
  };

  return (
    <div className={`sidebar ${isActive ? 'active' : ''}`} style={{ borderRight: "1px solid #c6c6c6", paddingRight: "2px" }}>
      <ToastContainer />
      <div className="menu-btn" onClick={toggleSidebar}><CaretLeft weight="bold" /></div>
      <div className="head">
        <div className="user-img">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" alt="User" />
        </div>
        <div className="user-details">
          <p className="title">Welcome</p>
          <p className="name">{details.first_name} {details.second_name}</p>
        </div>
      </div>
      <div className="nav">
        <div className="menu">
          <ul>
            <li className={activeItem === 'writeEmail' ? 'active' : ''} onClick={() => handleItemClick('writeEmail', 'chat')}>
              <a href="#"><HouseSimple weight="bold" className="icon" /><span className="text">Write Email</span></a>
            </li>
            <li className={activeItem === 'pastEmails' ? 'active' : ''} onClick={() => handleItemClick('pastEmails', 'pastEmails')}>
              <a href="#"><CalendarBlank weight="bold" className="icon" /><span className="text">Past Emails</span></a>
            </li>
            <li className={activeItem === 'tools' ? 'active' : ''} onClick={() => handleItemClick('tools', 'tools')}>
              <a href="#"><FileText weight="bold" className="icon" /><span className="text">Tools</span></a>
            </li>
          </ul>
        </div>
      </div>
      <div className="menu">
        <ul>
          <li onClick={handleLogout}>
            <a href="#"><SignOut weight="bold" className="icon" /><span className="text">Logout</span></a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
