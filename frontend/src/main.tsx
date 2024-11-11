import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import App from "./components/App/App.tsx"
import ErrorPage from "./components/ErrorPage/ErrorPage.tsx"
import Book from "./components/Book/Book.tsx"
import Login from "./components/Login/Login.tsx"
import Register from "./components/Register/Register.tsx"
import Page404 from "./components/ErrorPage/404/404.tsx"
import Home from "./components/Home/Home.tsx"
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.tsx"
import AboutUs from "./components/AboutUs/AboutUs.tsx"

import "./index.css"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {path: "", element: <Home />},
      {path: 'about-us', element: <AboutUs />},
      {path: "book/:bookId", element: <Book />},
      {path: '*', element: <Page404 />},
      {
        path: "account",
        element: <Outlet />,
        children: [
          {
            path: 'user',
            element: <Outlet />,
            children: [
              {path: "login", element: <Login parent='user' />},
              {path: "register", element: <Register parent='user' />},
              {path: "forgot-password", element: <ForgotPassword parent='user' />},
            ]
          },
          {
            path: 'seller',
            element: <Outlet />,
            children: [
              {path: "login", element: <Login parent='seller' />},
              {path: "register", element: <Register parent='seller' />},
              {path: "forgot-password", element: <ForgotPassword parent='seller' />},
            ]
          }
        ]
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
