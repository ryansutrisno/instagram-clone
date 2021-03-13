import {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [pict, setPict] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image, setImage] = useState("")
    
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setPict(result.mypost)
        })
    }, [])

    useEffect(() => {
        if(image) {
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
                fetch('/updatephoto', {
                    method: "put",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer "+localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        picture: data.url
                    })
                }).then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({...state, picture:result.picture}))
                    dispatch({type: "UPDATEPHOTO", payload: result.picture})
                })
            })
            .catch(err => {
            console.log(err)
            })
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
    }

    return (
        <div style={{maxWidth: '70%', margin: '0px auto'}}>
            <div style={{margin: '18px 0px', borderBottom: '1px solid grey'}}>
                <div style={{display: 'flex', justifyContent: 'space-around', }}>
                <div>
                    <img style={{width: "160px", height: "160", borderRadius: "80px"}}
                    src={state ? state.picture : "loading"} alt={state ? state.name : ""}
                    />
                </div>
                <div>
                    <h4>{state ? state.name : "loading"}</h4>
                    <h5>{state ? state.email : "loading"}</h5>
                    <div style={{display:'flex', justifyContent: 'space-between', width: '108%'}} >
                        <h6>{pict.length} posts</h6>
                        <h6>{state ? state.followers.length : "0"} followers</h6>
                        <h6>{state ? state.following.length : "0"} following</h6>
                    </div>
                </div>
              </div>
                <div className="file-field input-field" style={{margin: "10px"}}>
                    <div className="btn transparent">
                    <span className="material-icons" style={{padding: '5px', marginTop: '5px', color: "black"}}>
                    camera_alt
                    </span>
                    <input type="file" onChange={(e)=> updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper" style={{maxWidth: "25%"}}>
                    <input
                    className="file-path validate"
                    type="text"
                    placeholder="profile_image.jpg/.png"
                    />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {pict.map(item => {
                    return (
                        <img key={item._id} className="item" src={item.photo} alt={item.title} />
                    )
                })}
            </div>
        </div>
    )
}

export default Profile;