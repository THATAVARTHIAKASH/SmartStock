import React, { useContext, useState, useEffect } from "react";
import { firebaseAuth } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({
    uid: null,
    initialized: false,
    projects: [],
  });
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setCurrentUser({ ...user, initialized: true });
      } else {
        setCurrentUser({ uid: null, initialized: true });
      }
    });
  }, []);

  const loginWithEmail = async (email, password) => {
    try {
      const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
      setCurrentUser({ ...userCred.user, initialized: true });
      return userCred.user;
    } catch (error) {
      throw new Error(error);
    }
  };

  const signupWithEmail = async (email, password) => {
    try {
      const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      setCurrentUser({ ...userCred.user, initialized: true });
      return userCred.user;
    } catch (error) {
      throw new Error(error);
    }
  };

  const sendResetEmail = async (email) => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      setCurrentUser({ ...result.user, initialized: true });
    } catch (error) {
      throw new Error(error);
    }
  };

  const logOut = () => {
    return signOut(firebaseAuth);
  };
  const value = {
    currentUser,
    loginWithEmail,
    logOut,
    signInWithGoogle,
    sendResetEmail,
    setCurrentUser,
    signupWithEmail,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
