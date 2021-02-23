import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
  const history = useHistory()
  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  useEffect(()=> {
    if(url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type":"application/json",
          "Authorization":"Bearer "+ localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title,
          caption,
          photo: url
        })
      }).then(res=> res.json())
      .then(data=>{
        if (data.error) {
          M.toast({html: data.error, displayLength: 5000, classes: '#c62828 red darken-3'})
        }
        else {
          M.toast({html: "Post successfully", displayLength: 5000, classes: '#43a047 green darken-1'})
          history.push('/')
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [url])

  const postDetails = () => {
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
    return (
      <div
        className="card input-field"
        style={{
          margin: "30px auto",
          maxWidth: "500px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <input 
          type="text" 
          placeholder="title"
          value={title}
          onChange={(e)=> setTitle(e.target.value)} />
        <input 
          type="text" 
          placeholder="caption"
          value={caption}
          onChange={(e)=> setCaption(e.target.value)} />
        <div className="file-field input-field">
          <div className="btn waves-effect waves-light blue darken-2">
            <span>Upload Image</span>
            <input type="file" onChange={(e)=> setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="example_image.jpg"
            />
          </div>
        </div>
        <button 
        className="btn waves-effect waves-light blue darken-2"
        onClick={()=>postDetails()}>
          Submit Post
        </button>
      </div>
    );
}

export default CreatePost;