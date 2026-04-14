import { useState } from 'react'

function Post({ post }) {
  return (
    <div>  
        <img src={post.imageUrl}/>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <br />
        <div className="grid grid-cols-2" >
            <p>{post.id_user}</p>
            <p>{post.createdAt}</p>
        </div>
    </div>
  )
}

export default Post
