 import './App.css';

import { Auth } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore'
import { useEffect, useState } from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import BlogPage from './BlogPage'
import PostPage from './PostPage'
import BlogCreate from './BlogCreate'
import SignIn from './SignIn'

import { Blog } from './models'

// State variables TBD
function App () {
  const [blogs, setBlogs] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState({})

  useEffect(() => {
    
    const getData = async () => {
      try {
        // query for all blog posts, then store them in state
        const blogData = await DataStore.query(Blog)
        setBlogs(blogData)
      } catch (err) {
        console.error(err)
      }
      try {
        // Implemented a query to fetch blog data
        const blogData = await DataStore.query(Blog)
        setBlogs(blogData)
        // Implement user authentication to check if user is signed in
        const user = await Auth.currentAuthenticatedUser()
        // Check to see if user is admin
        // User object has a 'signInUserSession object > accessToken object
        // and then within payload, we check to see what groups user is apart of
        // if user is admin, they will have role of admin.
        //
        // Only set user as Admin if they have role.
        setIsAdmin(user.signInUserSession.accessToken.payload['cognito:groups'].includes('admin'))
        setUser(user)
      } catch (err) {
        console.error(err)
      }
    }
    getData()
  }, [])

  return (
    <div className='App'>
      {/* React Router utilised to create different paths that render different components */}
      <Switch>
        <Route path='/sign-in'>
          <SignIn />
        </Route>
        <Route path='/blog/create'>
          <BlogCreate isAdmin={isAdmin} />
        </Route>
        <Route path='/blog/:name'>
          <BlogPage user={user} />
        </Route>
        <Route path='/post/:name'>
          <PostPage user={user} />
        </Route>
        <Route path='/' exact>
          <h1>Blogs</h1>
           {/* If user is an empty object, tell them to sign in */}
          {!user.attributes && <Link to='/sign-in'>Sign In</Link>}
          {/* If user is signed in, give them the option to sign out */}
          {user.attributes && <button onClick={async () => await Auth.signOut()}>Sign Out</button>}
          {blogs.map(blog => (
            <Link to={`/blog/${blog.name}`} key={blog.id}>
              <h2>{blog.name}</h2>
            </Link>
          ))}
        </Route>
      </Switch>
    </div>
  )
}

export default App;
