// eslint-disable-next-line
import {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'

const Home = () => {
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const commentPost = (text, postId) => {
        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
        .then(result => {
            const newData = data.map(item => {
                if(item._id === result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log(err)
        })
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'delete',
            headers: {
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            const newData = data.filter(item => {
                return item._id !== result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                    <div className="card home-card" key={item._id}>
                        <div style={{padding: "10px", display: 'flex'}}>
                            <img 
                                style={{width: "30px", height: "30px", borderRadius: "15px"}}
                                src={state ? state.picture : "loading"} alt={state ? state.name : ""}
                                />
                                <div>
                                    <Link style={{padding: '10px', fontWeight: 'bold'}} to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
                                    {item.postedBy._id === state._id && <i className="material-icons" style={{right: '5px', position: 'absolute', cursor: 'pointer'}} onClick={() => deletePost(item._id)}>delete</i>}
                                </div>
                        </div>
                            <div className="card-image">
                                <img src={item.photo} alt="" />
                            </div>
                        <div className="card-content">
                        <i className="material-icons" style={{color: 'red'}}>favorite</i>
                            { item.likes.includes(state._id) ?
                                <i className="material-icons thumb" onClick={() => {unlikePost(item._id)}}>thumb_down</i>
                                :
                                <i className="material-icons thumb" onClick={() => {likePost(item._id)}}>thumb_up</i>
                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6 style={{fontWeight: 'bold'}}>{item.title}</h6>
                            <p>{item.caption}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                commentPost(e.target[0].value,item._id)
                            }}>
                                <input type="text" placeholder="add a coment" />
                            </form>
                        </div>
                    </div>
                )
                })
            }
        </div>
    )
}

export default Home;