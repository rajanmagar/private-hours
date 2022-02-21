import React from 'react';
import { signOut } from 'firebase/auth';

const Signout = ({ auth }) => {
  return (
    <div>
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </div>
  )
}

export default Signout;
