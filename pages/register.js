import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from "../firebase";
import Layout from '../components/Layout';

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    error: null,
    loading: false
  })
  const router = useRouter()
  const { name, email, password, error, loading } = data
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }
  const handleSubmit = async e => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true })
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" })
    }
    try {
      // to create user in firebase
      const result = await createUserWithEmailAndPassword(auth, email, password)
      // to store user in firestore database
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true
      })
      setData({ name: "", email: "", password: "", error: null, loading: false })
      router.push('/')
    } catch (error) {
      setData({ ...data, error: error.message, loading: false })
    }
  }
  return (
    <Layout>
      <section>
        <h3>Create an Account</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name</label>
            <input type="text" name='name' value={name} onChange={handleChange} />
          </div>
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
            <button disabled={loading}>{loading ? 'Creating ...' : 'Register'}</button>
          </div>
        </form>
      </section>
    </Layout>
  );
}

export default Register;
