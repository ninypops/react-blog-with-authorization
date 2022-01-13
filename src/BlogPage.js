import { DataStore } from 'aws-amplify'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

import { Post, Blog } from './models'

export default function BlogPage ({ user }) {
  const { name } = useParams()

  const [posts, setPosts] = useState([])
  useEffect(() => {
    const getData = async () => {
      // Only getting the blog for the name we want
      const data = await DataStore.query(Blog, p => p.name('eq', name))
      // Posts only show if id equal to the blog we're querying ^
      const posts = await DataStore.query(Post, p => p.blogID('eq', data[0].id))
      setPosts(posts)
    }
    getData()
  }, [])

  return (
    <div>
      <h1>{name}</h1>
      {
        posts.map(post => (
          <h2 key={post.id}>
            <Link to={`/post/${post.title}`}>
              {post.title}
            </Link>
          </h2>)
        )
    }
    </div>
  )
}