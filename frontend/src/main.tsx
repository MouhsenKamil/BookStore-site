import React from "react"
import ReactDOM from "react-dom/client"


import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./components/App/App.tsx"
import ErrorPage from "./components/ErrorPage/ErrorPage.tsx"
import Book from "./components/Book/Book.tsx"
import Login from "./components/Login/Login.tsx"
import Register from "./components/Register/Register.tsx"
import Page404 from "./components/ErrorPage/404/404.tsx"
import Home from "./components/Home/Home.tsx"

import "./index.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {path: "", element: <Home />},
      {path: "books/:bookId", Component: Book},
      {path: "login", element: <Login />},
      {path: "register", element: <Register />},
      {path: '*', element: <Page404 />}
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
