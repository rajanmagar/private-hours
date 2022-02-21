import React from 'react';
import { getAuth } from 'firebase/auth';

import styles from '../styles/Home.module.css';

// const auth = getAuth()

const Chatmessage = ({ message: { text, uid, photoURL }, auth: { currentUser } }) => {
  const messageClass = uid === currentUser.uid ? 'sent' : 'received'
  return (
    <div className={styles.chat}>
      <img src={photoURL} className={styles.userImage} />
      <p>{text}</p>
      <span>{messageClass}</span>
    </div>
  );
}

export default Chatmessage;
