import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.tsx'
import BookDetails from './components/BookDetails.tsx'
import Cart from './components/Cart.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/books/:id" Component={BookDetails} />
        <Route path="/cart" Component={Cart} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
    </Router>
  );
};
