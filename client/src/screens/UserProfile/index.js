import {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'

const UserProfile = () => {
    const [profile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            setProfile(result)
        })
    }, [])

    return (
        <>
        {profile ? 
            <div style={{maxWidth: '70%', margin: '0px auto'}}>
                <div style={{display: 'flex', justifyContent: 'space-around', margin: '18px 0px', borderBottom: '1px solid'}}>
                    <div>
                        <img style={{width: "160px", height: "160", borderRadius: "80px"}}
                        src="https://images.unsplash.com/photo-1550927312-3af3c565011f?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NTN8fHBlcnNvbnxlbnwwfDJ8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" alt=""
                        />
                    </div>
                    <div>
                        <h4>{profile.user.name}</h4>
                        <h5>{profile.user.email}</h5>
                        <div style={{display:'flex', justifyContent: 'space-between', width: '108%'}} >
                            <h6>{profile.posts.length >= 0 ? profile.posts.length : 0} posts</h6>
                            <h6>100 followers</h6>
                            <h6>10 following</h6>
                        </div>
                    </div>
                </div>
                <div className="gallery">
                    {profile.posts.map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })}
                </div>
            </div>
        : <h2>Loading...</h2>}
        </>
    )
}

export default UserProfile;