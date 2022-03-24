import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from "./firebase";
import Layout from '../components/Layout';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    error: null,
    loading: false
  })
  const router = useRouter()
  const { email, password, error, loading } = data
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true })
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" })
    }
    try {
      // to create user in firebase
      const result = await signInWithEmailAndPassword(auth, email, password)
      // to store user in firestore database
      await updateDoc(doc(db, 'users', result.user.uid), {
        isOnline: true
      })
      setData({ email: "", password: "", error: null, loading: false })
      router.push('/')
    } catch (error) {
      setData({ ...data, error: error.message, loading: false })
    }
  }
  return (
    <Layout>
      <section>
        <h3>Login into your Account</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email'>Email</label>
            <input type="text" name='email' value={email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input type="password" name='password' value={password} onChange={handleChange} />
          </div>
          {error && <p>{error}</p>}
          <div>
            <button disabled={loading}>{loading ? 'Logging in ...' : 'Login'}</button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default Login;
