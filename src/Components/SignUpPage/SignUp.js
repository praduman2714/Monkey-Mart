import { useRef } from 'react';
import { createUserWithEmailAndPassword  } from "firebase/auth";
import { set, ref } from "firebase/database";

import Style from './SignUp.module.css';
import {auth, database} from '../../firebaseinit';
import { toast } from 'react-toastify';
import { useState } from 'react';

function SignUp() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const[error , setError] = useState(null);
  const [loading, setIsLoading] = useState(false)

  function handleClear() {
    nameRef.current.value = "";
    emailRef.current.value = "";
    passwordRef.current.value = "";
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user in the Firebase Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        name: name,
        email: email,
      });

      // Clear the input fields after successful signup
      handleClear();
      toast.success('User Signed Up !');
      // Sign-in successful, redirect to home page
      window.location.href = '/';
      console.log("User signed up:", user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(error);
      console.error("Error signing up:", errorCode, errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <>
      
      <div className={Style.form}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" ref={nameRef} /> <br />
          <input type="email" placeholder="Email" ref={emailRef} /> <br />
          <input type="password" placeholder="Password" ref={passwordRef} /> <br />
          <button  type="submit">{loading ? '>> Loading' : 'Sign Up'}</button>
          {error ? <p>{error.message}</p> : null}
        </form>
      </div>
      
    </>
  )
}

export default SignUp;
