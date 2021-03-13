import {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Register = () => {
  const history = useHistory()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)

  useEffect(() => {
    if(url) {
      uploadFields()
    }
  }, [url])

  const uploadPic = () => {
    const formdata = new FormData()
    formdata.append("file", image)
    formdata.append("upload_preset", "instaxgram")
    formdata.append("cloud_name", "rstrz")
    fetch("https://api.cloudinary.com/v1_1/rstrz/image/upload", {
      method: "post",
      body: formdata
    })
    .then(res => res.json())
    .then(data => {
      setUrl(data.url)
    })
    .catch(err => {
      console.log(err)
    })
  }

  const uploadFields = () => {
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
        password,
        picture: url
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

  const PostData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
    }
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
              <div className="file-field input-field">
                <div className="btn waves-effect waves-light blue-grey darken-4">
                  <span class="material-icons" style={{padding: '5px', marginTop: '5px'}}>
                    insert_photo
                  </span>
                  <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                  <input
                  className="file-path validate"
                  type="text"
                  placeholder="profile_image.jpg"
                  />
                </div>
              </div>
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