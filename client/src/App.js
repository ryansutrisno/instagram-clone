import {BrowserRouter as Router, Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './screens/Home'
import Login from './screens/Login'
import Profile from './screens/Profile'
import Register from './screens/Register'

import './App.css';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
      </Router>
    </>
  );
}

export default App;
