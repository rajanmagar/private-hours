import React, { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from '../styles/user.module.css';

const User = ({ user, selectUser, you, chat }) => {
  const friend = user?.uid
  const [data, setData] = useState('');
  useEffect(() => {
    const id = you > friend ? `${you + friend}` : `${friend + you}`
    const unsub = onSnapshot(doc(db, 'lastMsg', id), doc => {
      setData(doc.data())
    })
    return () => unsub()
  }, []);
  return (
    <div className={`${styles.userContainer} ${chat.name === user.name && styles.selectedUser}`} onClick={() => selectUser(user)}>
      <div className={styles.userInfo}>
        <div className={styles.userDetail}>
          <img src={user.avatar || 'https://www.pngkey.com/png/detail/950-9501315_katie-notopoulos-katienotopoulos-i-write-about-tech-user.png'} alt="avatar" />
          <h4>{user.name}</h4>
          {data?.from !== you && data?.unread && (<small className={styles.unread}>New</small>)}
        </div>
        <div className={`${styles.userStatus} ${user.isOnline ? styles.online : styles.offline}`}></div>
      </div>
      {data && (<p className={styles.truncate}><strong>{data.from === you ? "Me: " : null}</strong>{data.text}</p>)}
    </div>
  );
}

export default User;
