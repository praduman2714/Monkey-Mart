import { useRef, useEffect } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";

import Style from './SignIn.module.css';
import { auth } from "../../firebaseinit";
import { Link } from 'react-router-dom';
import { useValue } from '../../context';

function SignIn() {
  const {toggleSignUp} = useValue();
  const emailRef = useRef();
  const passwordRef = useRef();

  useEffect(() => {
    // Check if the user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is already signed in, redirect to home page
        window.location.href = '/';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Sign-in successful, redirect to home page
      window.location.href = '/';
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing in:", errorCode, errorMessage);
    }
  };

  return (
    <>
      <div className={Style.form}>
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" ref={emailRef} /> <br />
          <input type="password" placeholder="Password" ref={passwordRef} /> <br />
          
          <button type="submit">Sign In</button>
          <div className={Style.Link} >
          <Link  onClick={toggleSignUp} to = '/singUp'>Register User</Link> 
          </div>
        </form>
      </div>
    </>
  );
}

export default SignIn;
