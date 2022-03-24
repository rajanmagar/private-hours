import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../pages/firebase';
import { AuthContext } from '../context/auth';

const Navbar = () => {
  const { user } = useContext(AuthContext)
  const router = useRouter()
  const handleSignOut = async () => {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: false
    })
    await signOut(auth);
    router.push('/login');
  }
  return (
    <nav>
      <h3>
        <Link href="/">Messenger</Link>
      </h3>
      <div>
        {user ? <><Link href="/profile">Profile</Link><button onClick={handleSignOut}>Logout</button></> :
          <><Link href="/register">Register</Link>
            <Link href="/login">Login</Link></>}
      </div>
    </nav>
  );
}

export default Navbar;
