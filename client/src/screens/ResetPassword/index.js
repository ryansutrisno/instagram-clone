import {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const ResetPassword = () => {
  const history = useHistory()
  const [email, setEmail] = useState("")
  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: 'Invalid email', displayLength: 5000, classes: '#c62828 red darken-3'})
      return
    }
    fetch('/reset-password', {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        email,
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
              placeholder="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)} />
            <button
              className="btn waves-effect waves-light blue darken-2"
              onClick={()=>PostData()}
            >
              Reset Password
            </button>
        </div>
      </div>
    );
}

export default ResetPassword;