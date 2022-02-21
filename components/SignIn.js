import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
//gita@khanal.com, bemine
const Signin = ({ auth }) => {
  const [user, setUser] = useState({ email: '', password: '' })

  const handleSignIn = (e) => {
    setUser((pre) => {
      return {
        ...pre,
        [e.target.type]: e.target.value
      }
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(res => {
        console.log('signiii', res)
      })
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" value={user.email} onChange={handleSignIn} />
        <input type="password" value={user.password} onChange={handleSignIn} />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Signin;
