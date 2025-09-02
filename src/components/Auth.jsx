import { useState } from 'react';
import "../components/auth.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from './firebase';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
const navigate = useNavigate();

  // switch form states

  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };


  // login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   try {
    await signInWithEmailAndPassword(auth,email,password);
    toast.success("logged in succsesfully");
    navigate("/home")
   } catch (error) {
    toast.error(error.message);
   }
  };

  // register states
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');

  const handleReg = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          display_name: name + surname,
          first_name: name,
          second_name: surname
        })
      }

      setRegEmail("");
      setRegPassword("");
      setSurname("");
      setName("");

      toast.success('registered succsefully !');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="form-container">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className={`login-container ${isLogin ? '' : 'hidden'}`}>
        <h1 className="title">Welcome Back!</h1>
        <p className="desc" style={{ fontSize: "16px", color: "#555" }}>
          Log in to access your personalized email dashboard and streamline your communication.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="account-controls">
            <button type="submit" className="primary-button">
              Log In
            </button>
            <a href="#">Forgot Password?</a>
          </div>
        </form>
        <span className="line"></span>
        <span className="signup-text">
          New here? <a onClick={toggleForm}>Create an account</a>
        </span>
      </div>

      <div className={`placeholder-banner ${isLogin ? '' : 'shifted'}`}>
        <img src="https://miro.medium.com/max/4000/1*m9IJdAYW04MYh75ivpwUNA.png" alt="banner" className="banner" />
      </div>

      <div className={`signup-container ${isLogin ? 'hidden' : ''}`}>
        <h1 className="title">Create Account</h1>
        <p className="desc" style={{ fontSize: "16px", color: "#555" }}>
          Join us to experience seamless email management and collaboration.
        </p>
        <form onSubmit={handleReg}>
          <div className="input-container">
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Last Name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email Address"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
          </div>
          <div className="account-controls">
            <button type="submit" className="primary-button">
              Sign Up
            </button>
          </div>
          <span className="line"></span>
          <span className="signup-text">
            Already have an account? <a onClick={toggleForm}>Log in here</a>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Auth;
