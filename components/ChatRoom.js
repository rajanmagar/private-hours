import React, { useState, useRef } from 'react';
import { getFirestore, collection, serverTimestamp, orderBy, limit, query, doc, setDoc } from "firebase/firestore";
import { useCollectionData, useCollection } from 'react-firebase-hooks/firestore';
import ChatMessage from './ChatMessage';
import SignOut from "./SignOut";
import styles from '../styles/Home.module.css'

const Chatroom = ({ auth, app }) => {
  const messageRef = collection(getFirestore(app), 'messages')
  const queries = query(messageRef, orderBy('createdAt', 'asc'), limit(5))
  const [messages] = useCollectionData(queries, { idField: 'id' })
  const [formValue, setFormValue] = useState('')
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await setDoc(doc(messageRef), {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }
  const dummy = useRef()
  console.log('suususus', messages)
  return (
    <>
      <div className={styles.chatBox}>
        <h3>Chat Room</h3>
        {messages?.map(msg => <ChatMessage key={msg.id} message={msg} auth={auth} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <SignOut auth={auth} />
    </>
  );
}

export default Chatroom;
