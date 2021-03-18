import {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [usersDetails, setUsersDetails] = useState([])
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])

  const renderNav = () => {
    if(state) {
      return [
        <li key="1">
          <i data-target="modal1" className="material-icons modal-trigger" style={{color:'black'}}>search</i>
        </li>,
        <li key="2">
          <Link to="/create">
            <i className="material-icons">create</i>
          </Link>
        </li>,
        <li key="3">
          <Link to="/profile">
          <i className="material-icons">person</i>
          </Link>
        </li>,
        <li key="4">
          <Link to="/followingpost">
          <i className="material-icons">apps</i>
          </Link>
        </li>,
        <li key="5">
          <a
            style={{marginTop: 5}}
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
        <li key="6">
          <Link to="/register">
            <span>Register</span>
          </Link>
        </li>,
        <li key="7">
          <Link to="/login">
            <span>Login</span>
          </Link>
        </li>,
      ];
    }
  }
  
  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
    .then(results => {
      setUsersDetails(results.user)
    })
  }
    return (
      <div>
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
          <div id="modal1" className="modal" ref={searchModal} style={{color:'black'}}>
            <div className="modal-content">
              <input 
                type="text" 
                placeholder="Search users"
                value={search}
                onChange={(e)=>fetchUsers(e.target.value)} />
                <ul className="collection">
                  {usersDetails.map(item => {
                    return <Link to={item._id !== state._id ? "/profile/"+item._id : "/profile"} onClick={()=> {
                      M.Modal.getInstance(searchModal.current).close()
                      setSearch('')
                    }}><li className="collection-item">{item.name}</li></Link>
                  })}
                </ul>
            </div>
            <div className="modal-footer">
              <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
            </div>
          </div>
        </div>
    );
}

export default Navbar;