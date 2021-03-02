import {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
    const [pict, setPict] = useState([])
    const {state, dispatch} = useContext(UserContext)
    
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

    return (
        <div style={{maxWidth: '70%', margin: '0px auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-around', margin: '18px 0px', borderBottom: '1px solid'}}>
                <div>
                    <img style={{width: "160px", height: "160", borderRadius: "80px"}}
                    src="https://images.unsplash.com/photo-1550927312-3af3c565011f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NTN8fHBlcnNvbnxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt=""
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