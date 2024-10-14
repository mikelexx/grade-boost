"use client"; // Ensure this is the first line in your file
import { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import UserService from '../../services/firebaseUser';
import app from '../../firebaseConfig';
import { useRouter } from 'next/navigation'; // Use next/navigation for client components

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function Authentication() {
  const router = useRouter(); // useRouter should be here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // toggle between login and signup
  const [hasMounted, setHasMounted] = useState(false); // Track mounting
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indicator
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(()=>{
	  setErrorMessage('');
  }, [isSignUp])

  if (!hasMounted) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email}  = result.user;
      console.log('Google sign-in successful:', result.user);
      const userData = await UserService.getUserData(uid);
      if(!userData){
	      await UserService.createUserDocument(uid, email ?? '')
      }
      router.push('/'); // Redirect to the homepage or any other page after successful sign-in
    } catch (error) {
      console.error('Google sign-in error:', error);
      setErrorMessage('Failed to sign in with Google. Please try again.'); // Set error message
    } finally{
    setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful:', result.user);
      router.push('/'); // Redirect to the homepage or another page
      setErrorMessage('');
    } catch (error) {
      console.error('Email sign-in error:', error);
      setErrorMessage('Invalid email or password. Please try again.'); // Set error message
    } finally{
	    setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
	  setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email sign-up successful:', result.user);
      const uid = result.user.uid;
      await UserService.createUserDocument(uid, email)

      router.push('/'); // Redirect to the homepage or another page
      setErrorMessage('');

    } catch (error) {
      console.error('Email sign-up error:', error);
      setErrorMessage('Sign-up failed. Please check your information.'); // Set error message

    } finally{
	    setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h1>

      <div className="bg-white p-8 shadow-md rounded-lg max-w-md w-full flex-grow">
      {loading && (
          <div className="flex justify-center mb-4">
            <div className="spinner" /> {/* Your spinner here */}
          </div>
        )}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
	    disabled={loading}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
	    disabled={loading}
          />
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}

        {isSignUp ? (
          <button onClick={handleEmailSignUp} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Sign Up
          </button>
        ) : (
          <button onClick={handleEmailSignIn} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Login
          </button>
        )}

        <div className="flex items-center justify-between mt-4">
          <button onClick={handleGoogleSignIn} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
            Sign in with Google
          </button>
        </div>

        <div className="text-sm text-center mt-6">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)} className="text-blue-500 hover:underline">
                Log in
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)} className="text-blue-500 hover:underline">
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

