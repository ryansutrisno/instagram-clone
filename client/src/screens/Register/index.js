import {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Register = () => {
  const history = useHistory()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: 'Invalid email', displayLength: 5000, classes: '#c62828 red darken-3'})
      return
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    }).then(res=> res.json())
    .then(data=>{
      if (data.error) {
        M.toast({html: data.error, displayLength: 5000, classes: '#c62828 red darken-3'})
      }
      else {
        M.toast({html: data.message, displayLength: 5000, classes: '#43a047 green darken-1'})
        history.push('/login')
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
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                className="btn waves-effect waves-light blue darken-2"
                onClick={()=> PostData()}>
                Register
              </button>
            <p>
              Already have an account ?{" "}
              <span style={{fontWeight: "bold"}}>
                <Link to="/login">Login</Link>
              </span>
            </p>
          </div>
        </div>
    );
}

export default Register;