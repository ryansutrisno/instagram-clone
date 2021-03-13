import {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'

const Navbar = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  const renderNav = () => {
    if(state) {
      return [
        <li key="1">
          <Link to="/create">
            <i className="material-icons">create</i>
          </Link>
        </li>,
        <li key="2">
          <Link to="/profile">
          <i className="material-icons">person</i>
          </Link>
        </li>,
        <li key="3">
          <Link to="/followingpost">
          <i className="material-icons">apps</i>
          </Link>
        </li>,
        <li key="4">
          <a
            style={{marginTop: 8}}
            onClick={() => {
              localStorage.clear()
              dispatch({type: "CLEAR"})
              history.push('/login')
            }}><span className="material-icons">
            logout
            </span></a>
      </li>
      ];
    } else {
      return [
        <li key="5">
          <Link to="/register">
            <span>Register</span>
          </Link>
        </li>,
        <li key="6">
          <Link to="/login">
            <span>Login</span>
          </Link>
        </li>,
      ];
    }
  }
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper white">
            <Link to={state ? "/" : "/login"} className="brand-logo left">
              Instaxgram
            </Link>
            <ul id="nav-mobile" className="right">
              {renderNav()}
            </ul>
          </div>
        </nav>
      </div>
    );
}

export default Navbar;