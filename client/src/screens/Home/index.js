import {useState, useEffect, useContext} from 'react'
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
            const newdata = data.map(item => {
                if(item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newdata)
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
            const newdata = data.map(item => {
                if(item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })
            setData(newdata)
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                    <div className="card home-card" key={item._id}>
                        <h5 style={{padding: 5, margin: "5px 0px 0px 5px"}}>{item.postedBy.name}</h5>
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
                            <h6>{item.title}</h6>
                            <p>{item.caption}</p>
                            <input type="text" placeholder="add a coment" />
                        </div>
                    </div>
                )
                })
            }
        </div>
    )
}

export default Home;