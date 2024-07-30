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
    element: <Auth/>
  },
  {
    path: "/home",
    element: <Home/>,
    children: [
        {
          index: true,
          element: <EmailChat/>
        }
      ,
      {
        index: true,
        path:"chat",
        element: <EmailChat/>
      },
      {
        path: "pastEmails",
        element: <PastEmails/>
      },
      {
        path: "tools",
        element: <ComingSoon/>
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
