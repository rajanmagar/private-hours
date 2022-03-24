import React from 'react';
import styles from '../styles/user.module.css';

const User = ({ user, selectUser }) => {
  return (
    <div className={styles.userContainer} onClick={() => selectUser(user)}>
      <div className={styles.userInfo}>
        <div className={styles.userDetail}>
          <img src={user.avatar || 'https://media-exp1.licdn.com/dms/image/C4D03AQFOTv_b3uC5oA/profile-displayphoto-shrink_200_200/0/1595729124307?e=1653523200&v=beta&t=D2BslOQzTvIrGTFfjGEd-FySb9HQTUkJq_Xr7d0Tlqg'} alt="avatar" />
          <h4>{user.name}</h4>
        </div>
        <div className={`${styles.userStatus} ${user.isOnline ? styles.online : styles.offline}`}></div>
      </div>
    </div>
  );
}

export default User;
