import {useEffect, createContext, useReducer, useContext} from 'react'
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './screens/Home'
import Login from './screens/Login'
import Profile from './screens/Profile'
import Register from './screens/Register'
import CreatePost from './screens/CreatePost'
import UserProfile from './screens/UserProfile'
import SubscribesUserPost from './screens/SubscribesUserPost'
import {reducer, initialState} from './reducers/userReducer'

import './App.css';

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type: "USER", payload: user})
    } else {
      history.push('/login')
    }
  }, [])

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/create" component={CreatePost} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/followingpost" component={SubscribesUserPost} />
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <Router>
        <Navbar />
          <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
