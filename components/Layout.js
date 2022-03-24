import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import AuthProvider from '../context/auth';
import styles from '../styles/Home.module.css'

const Layout = ({ children }) => {
  return (
    <AuthProvider>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </AuthProvider>
  );
}

export default Layout;
