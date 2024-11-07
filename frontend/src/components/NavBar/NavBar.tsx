import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

import './NavBar.css'


export default function NavBar() {
  const auth = useAuth()

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {auth
            ? <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
            : <li>
              <Link to="/profile">
                <img src="" alt="" />
              </Link>
            </li>
          }
        </ul>
      </nav>
    </header>
  )
}
