import React, { useState } from 'react';
import { auth } from '../config/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleEmailSignIn}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        {error && <p>{error}</p>}
        <button type="submit">Sign In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span
          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={switchToSignUp}
        >
          Create Account
        </span>
      </p>
    </div>
  );
};

export default SignIn;