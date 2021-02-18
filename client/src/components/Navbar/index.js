import {Link} from 'react-router-dom'

const Navbar = () => {
    return (
      <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">Instaxgram</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;