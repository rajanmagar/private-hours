import React from 'react';
import Attachment from './svg/attachment';
import styles from '../styles/message.module.css';

const Messageform = ({ handleSubmit, text, setText, setImg }) => {
  return (
    <form className={styles.messageFormContainer} onSubmit={handleSubmit}>
      <label htmlFor='img'>
        <Attachment />
      </label>
      <input type="file" id="img" accept='image/*' style={{ display: "none" }} onChange={e => setImg(e.target.files[0])} />
      <div>
        <input type="text" placeholder="Message..." value={text} onChange={e => setText(e.target.value)} />
      </div>
      <div>
        <button className={styles.send}>Send</button>
      </div>
    </form>
  );
}

export default Messageform;
