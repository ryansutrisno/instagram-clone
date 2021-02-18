import {Link} from 'react-router-dom'

const Login = () => {
    return (
      <>
      <div className="mycard">
        <div className="card auth-card input-field">
        <h2>Instaxgram</h2>
          <form>
            <input type="text" placeholder="email" />
            <input type="password" placeholder="password" />
            <button
              className="btn waves-effect waves-light #64b5f6 blue lighten-2"
            >
              Login
            </button>
          </form>
          <p><Link to="/register">Don't have an account ?</Link></p>
        </div>
      </div>
      </>
    );
}

export default Login;