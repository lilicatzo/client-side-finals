import React, { useState } from 'react';
import { auth } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import NavigationBar from '../NavigationBar.js'; 
import fruitsImage from '../assets/fruits.png'; 

const SignIn = ({ switchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (signInError) {
      setError(signInError.message);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="my-5 pd-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center">
              <div>
                <h2>Sign In</h2>
                <form onSubmit={handleEmailSignIn}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <button type="submit" className="btn btn-primary">
                    Sign In
                  </button>
                </form>
                <p className="mt-3">
                  Don't have an account?{' '}
                  <span
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={switchToSignUp}
                  >
                    Create Account
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <img
                src={fruitsImage}
                alt="Fruits"
                className="img-fluid mb-4 mt-md-0"
                style={{ maxHeight: '100%', maxWidth: '100%' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

