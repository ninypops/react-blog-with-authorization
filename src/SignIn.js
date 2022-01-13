import { withAuthenticator } from '@aws-amplify/ui-react'
import React from 'react'

import { Link } from 'react-router-dom'

function SignIn () {
  return (
    <div>
      <h1>Hello!</h1>
      <Link to='/home'>home</Link>
    </div>
  )
}
// User has to be signed in with authenticator in order to get to this page
export default withAuthenticator(SignIn)