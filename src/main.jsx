import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import Auth from './components/Auth.jsx';
import Home from './components/Layout\'/Home.jsx';
import EmailChat from './components/EmailChat.jsx';
import { ChakraProvider } from '@chakra-ui/react'
import PastEmails from './components/PastEmails.jsx';
import ComingSoon from './components/ToolsComingSoon.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth/>,
    action: () => console.log("Navigated to Auth route."),
  },
  {
    path: "/home",
    element: <Home/>,
    action: () => console.log("Navigated to Home route."),
    children: [
        {
          index: true,
          element: <EmailChat/>,
          action: () => console.log("Navigated to EmailChat route."),
        }
      ,
      {
        path: "chat",
        element: <EmailChat/>,
        action: () => console.log("Navigated to Chat route."),
      },
      {
        path: "pastEmails",
        element: <PastEmails/>,
        action: () => console.log("Navigated to PastEmails route."),
      },
      {
        path: "tools",
        element: <ComingSoon/>,
        action: () => console.log("Navigated to Tools route."),
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
  <RouterProvider router={router} >
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </RouterProvider>
  </ChakraProvider>,
)

// Added log to confirm routing setup
console.log("Router initialized.");
