import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { createInitialSearchHistory } from '../utils/CreateInitialSearchHistory';
import { auth } from '../config/FirebaseConfig';
import NavigationBar from '../NavigationBar.js'; 
import saladImage from '../assets/caesar_salad.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user.uid);
  
      // init search history
      await createInitialSearchHistory(userCredential.user.uid);
    } catch (signUpError) {
      setError(signUpError.message);
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
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
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
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-danger">{error}</p>}
                  <button type="submit" className="btn btn-primary">
                    Sign Up
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-6">
              <img
                src={saladImage}
                alt="Caesar Salad"
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

export default SignUp;
