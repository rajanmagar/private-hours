import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useRouter } from 'next/router';
import { initializeApp } from "firebase/app" // firebase SDK
import "firebase/firestore";  // firebase database
import { getAuth } from "firebase/auth";  // firebase database
import { useAuthState } from "react-firebase-hooks/auth";
import SignIn from "../components/SignIn";
import ChatRoom from '../components/ChatRoom';
import Layout from '../components/Layout';
import User from '../components/User';
import Message from '../components/Message';
import styles from '../styles/Home.module.css';
import { db, auth, storage } from './firebase';
import MessageForm from '../components/MessageForm';

// const app = initializeApp({
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
// })
// const auth = getAuth(app)

const Home = () => {
  const [user, loading, error] = useAuthState(auth)
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const router = useRouter()
  const you = auth.currentUser.uid
  useEffect(() => {
    // if (!user) {
    //   router.push('/login')
    // }
    const usersRef = collection(db, 'users')
    // create query object to list lout users other then mine
    const q = query(usersRef, where('uid', 'not-in', [you]))
    // execute query
    const unsub = onSnapshot(q, querySnapshot => {
      let users = []
      querySnapshot.forEach(doc => {
        users.push(doc.data())
      })
      setUsers(users)
    })
    return () => unsub()
  }, []);
  const selectUser = (user) => {
    setChat(user)
    const other = user.uid
    const id = you > other ? `${you + other}` : `${other + you}`
    const msgRef = collection(db, 'messages', id, 'chat')
    const q = query(msgRef, orderBy("createdAt", 'asc'))
    onSnapshot(q, querySnapshot => {
      let msgs = []
      querySnapshot.forEach(doc => {
        msgs.push(doc.data())
      })
      setMsgs(msgs)
    })
  }
  const handleSubmit = async e => {
    e.preventDefault()
    const other = chat.uid
    // messages => id => chat => addDoc
    const id = you > other ? `${you + other}` : `${other + you}`
    let url;
    if (img) {
      const imgRef = ref(storage, `images/${new Date().getTime()} - ${img.name}`)
      const snap = await uploadBytes(imgRef, img)
      const dlURL = await getDownloadURL(ref(storage, snap.ref.fullPath))
      url = dlURL
    }
    await addDoc(collection(db, 'messages', id, 'chat'), {
      text,
      from: you,
      to: other,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || ""
    })
    setText("")
  }
  return (
    <Layout>
      <h1 className={styles.title}>
        Welcome to <a href="https://nextjs.org">gitRa</a>
      </h1>
      <section>
        <div className={styles.homeContainer}>
          <div className={styles.usersContainer}>
            {
              users.map(user => <User key={user.uid} user={user} selectUser={selectUser} />)
            }
          </div>
          <div className={styles.messageContainer}>
            {chat ? <>
              <div className={styles.messagesUser}>
                <h3>{chat.name}</h3>
              </div>
              <div className={styles.messages}>
                {msgs.length ? msgs.map((msg, i) => <Message key={i} msg={msg} you={you} />) : null}
              </div>
              <MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setImg={setImg} />
            </> : <h3 className={styles.noChat}>Select a user to start converstation</h3>}
          </div>
        </div>
        {/* {user ? <ChatRoom auth={auth} app={app} /> : <SignIn auth={auth} />} */}
      </section>
    </Layout>
  )
}

export default Home