import React, { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import MealSearch from './components/MealSearch';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { auth } from './config/FirebaseConfig';
import DisplayHistory from './components/DisplayHistory';



function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('signIn');

  const switchView = (newView) => {
    setView(newView);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authenticatedUser) => {
      if (authenticatedUser) {
        setUser(authenticatedUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
    });
  };

  const renderProfile = () => {
    return (
      <div>
        <p>Welcome, {user.email}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'signIn':
        return <SignIn switchToSignUp={() => switchView('signUp')} />;
      case 'signUp':
        return <SignUp switchToSignIn={() => switchView('signIn')} />;
      default:
        return null;
    }
  };

  return (
    <UserProvider>
      <div className="App">
        <h1>Meal Search Platform</h1>
        {user ? (
          <>
            {renderProfile()}
            <MealSearch switchView={switchView} />
            <DisplayHistory /> 
          </>
        ) : (
          renderView()
        )}
      </div>
    </UserProvider>
  );
}

export default App;
