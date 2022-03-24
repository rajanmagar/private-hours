import React, { useRef, useEffect } from 'react';
import Moment from 'react-moment';
import styles from '../styles/message.module.css';

const Message = ({ msg, you }) => {
  const scrollRef = useRef()
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [msg]);
  return (
    <div className={`${styles.msgWrapper} ${msg.from === you ? styles.own : ""}`} ref={scrollRef}>
      <p className={msg.from === you ? styles.me : styles.friend}>{msg.media ? <img src={msg.media} alt={msg.text} /> : null}
        {msg.text}
        <br />
        <small><Moment fromNow>{msg?.createdAt?.toDate()}</Moment></small>
      </p>
    </div>
  );
}

export default Message;
