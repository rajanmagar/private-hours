import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/profile.module.css';
import Camera from '../components/svg/camera';
import { storage, db, auth } from '../pages/firebase';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { getDoc, doc, updateDoc } from 'firebase/firestore';

const Profile = () => {
  const [img, setImg] = useState('');
  const [user, setUser] = useState();
  const router = useRouter()
  useEffect(() => {
    getDoc(doc(db, 'users', auth.currentUser.uid)).then(docSnap => {
      if (docSnap.exists) {
        setUser(docSnap.data())
      }
    });
    if (!auth.currentUser) {
      router.push('/login')
    }
    if (img) {
      const uploadImg = (async () => {
        const imgRef = ref(storage, `avatar/${new Date().getTime()} - ${img.name}`)
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath))
          }
          const snap = await uploadBytes(imgRef, img)
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath))
          await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath
          })
          setImg("")
        } catch (error) {
          console.log(error)
        }
      })()
    }
  }, [img]);
  return (
    <Layout>
      {
        user ? (
          <section>
            <div className={styles.profileContainer}>
              <div className={styles.imgContainer}>
                <img src={user.avatar || 'https://media-exp1.licdn.com/dms/image/C4D03AQFOTv_b3uC5oA/profile-displayphoto-shrink_200_200/0/1595729124307?e=1653523200&v=beta&t=D2BslOQzTvIrGTFfjGEd-FySb9HQTUkJq_Xr7d0Tlqg'} alt='avatar' />
                <div className={styles.overlay}>
                  <div>
                    <label htmlFor='photo'>
                      <Camera />
                    </label>
                    <input type="file" accept='image/*' style={{ display: "none" }} id="photo" onChange={e => setImg(e.target.files[0])} />
                  </div>
                </div>
              </div>
              <div className={styles.textContainer}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <hr />
                <small>Joined On: {user.createdAt.toDate().toDateString()}</small>
              </div>
            </div>
          </section>
        ) : null
      }
    </Layout>
  );
}

export default Profile;
