import {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {UserContext} from '../../App'

const UserProfile = () => {
    const [profile, setProfile] = useState(null)
    const [showFollow, setShowFollow] = useState(true)
    const {state, dispatch} = useContext(UserContext)
    const {userid} = useParams()
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setProfile(result)
        })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type:"UPDATE", payload: {following:data.following, followers:data.followers}})
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState)=> {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers:[...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
        })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
        .then(data => {
            dispatch({type:"UPDATE", payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user", JSON.stringify(data))
            setProfile((prevState) => {
                const newFollower = prevState.user.followers.filter(item => item !== data._id)
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

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
                            <h6>{profile.user.followers.length} followers</h6>
                            <h6>{profile.user.following.length} following</h6>
                        </div>
                            {showFollow ?
                            <span style={{cursor: 'pointer', margin: "10px"}} className="material-icons"  onClick={()=>followUser()}>person_add_alt</span>
                            :
                            <span style={{cursor: 'pointer', margin: "10px"}} className="material-icons"  onClick={()=>unfollowUser()}>person_remove_alt</span>
                            }  
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