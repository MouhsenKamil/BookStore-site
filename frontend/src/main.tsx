import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import { AuthProvider } from "./hooks/useAuth.tsx"

import App from "./components/App/App.tsx"
import ErrorPage from "./components/ErrorPage/ErrorPage.tsx"
import Book from "./components/Book/Book.tsx"
import Login from "./components/Login/Login.tsx"
import Register from "./components/Register/Register.tsx"
import Page404 from "./components/ErrorPage/404.tsx"
import Home from "./components/Home/Home.tsx"
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.tsx"
import AboutUs from "./components/AboutUs/AboutUs.tsx"
import ContactUs from "./components/ContactUs/ContactUs.tsx"
import Profile from "./components/Profile/Profile.tsx"
import Cart from "./components/Customer/Cart/Cart.tsx"
import Orders from "./components/Customer/Orders/Orders.tsx"
import AHome from "./components/Admin/AHome/AHome.tsx"
import ABooks from "./components/Admin/ABooks/ABooks.tsx"
import ACustomers from "./components/Admin/ACustomers/ACustomers.tsx"
import ASellers from "./components/Admin/ASellers/ASellers.tsx"
import SHome from "./components/Sellers/SHome/SHome.tsx"
import Checkout from "./components/Customer/Checkout/Checkout.tsx"
import AddBook from "./components/Sellers/AddBook/AddBook.tsx"
import AuthChecker from "./components/AuthChecker.tsx"
import CSuccess from "./components/Customer/Checkout/CSuccess/CSuccess.tsx"

import "./index.css"
import AdvancedBookSearch from "./components/AdvancedSearch/AdvancedSearch.tsx"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {path: "checkout", element: <Checkout />},
      {path: "", element: <Home />},
      {path: "home", element: <Home />},
      {path: "search", element: <AdvancedBookSearch />},
      {path: 'about-us', element: <AboutUs />},
      {path: 'contact-us', element: <ContactUs />},
      {path: "book/:bookId", element: <Book />},
      {path: '*', element: <Page404 />},
      {
        path: "account",
        element: <Outlet />,
        children: [
          {
            path: 'user',
            // element: <Outlet />,
            children: [
              {path: "login", element: <Login parent='user' />},
              {path: "register", element: <Register parent='user' />},
              {path: "forgot-password", element: <ForgotPassword parent='user' />},
            ]
          },
          {
            path: 'seller',
            // element: <Outlet />,
            children: [
              {path: "login", element: <Login parent='seller' />},
              {path: "register", element: <Register parent='seller' />},
              {path: "forgot-password", element: <ForgotPassword parent='seller' />},
            ]
          },
          {
            path: 'admin',
            // element: <Outlet />,
            children: [
              {path: "login", element: <Login parent='admin' />},
            ]
          }
        ]
      },
      {
        path: 'seller',
        element: <AuthChecker redirectPath='/account/seller/login' userType="seller" />,
        children: [
          {path: '', element: <SHome />},
          {path: 'profile', element: <Profile />},
          {path: 'add-a-book', element: <AddBook />},
        ]
      },
      {
        path: 'user',
        element: <AuthChecker redirectPath='/account/user/login' userType="customer" />,
        children: [
          {path: 'profile', element: <Profile />},
          {path: 'cart', element: <Cart />},
          {path: 'orders', element: <Orders />},
          {path: "checkout", element: <Checkout />},
          {path: "checkout/success", element: <CSuccess />}
        ]
      },
      {
        path: 'admin',
        element: <AuthChecker redirectPath='/account/admin/login' userType="admin" />,
        children: [
          {path: '', element: <AHome />},
          {path: 'books', element: <ABooks />},
          {path: 'customers', element: <ACustomers />},
          {path: 'sellers', element: <ASellers />},
          {path: 'books', element: <ABooks />},
        ]
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
