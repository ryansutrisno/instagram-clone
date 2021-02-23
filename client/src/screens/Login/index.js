import {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Login = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: 'Invalid email', displayLength: 5000, classes: '#c62828 red darken-3'})
      return
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res=> res.json())
    .then(data=>{
      if (data.error) {
        M.toast({html: data.error, displayLength: 5000, classes: '#c62828 red darken-3'})
      }
      else {
        localStorage.setItem("jwt", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        dispatch({type: "USER", payload: data.user})
        M.toast({html: "Sign in successfully", displayLength: 5000, classes: '#43a047 green darken-1'})
        history.push('/')
      }
    })
    .catch(err => {
      console.log(err)
    })
  }
    return (
      <div className="mycard">
        <div className="card auth-card input-field">
        <h2>Instaxgram</h2>
            <input 
              type="text" 
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)} />
            <input 
              type="password" 
              placeholder="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} />
            <button
              className="btn waves-effect waves-light blue darken-2"
              onClick={()=>PostData()}
            >
              Login
            </button>
            <p>Don't have an account ? <span style={{fontWeight: 'bold'}}><Link to="/register">Register</Link></span></p>
        </div>
      </div>
    );
}

export default Login;