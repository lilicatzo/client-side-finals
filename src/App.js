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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null)

  const searchMeal = async (externalSearchTerm) => {
    const termToSearch = externalSearchTerm || searchTerm;
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termToSearch}`);
      const data = await response.json();
      setSearchResults(data.meals || []);
      setSelectedMeal(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
        {/* ... */}
        {user ? (
          <>
            {renderProfile()}
            <MealSearch 
              switchView={switchView} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchResults={searchResults}
              selectedMeal={selectedMeal}
              setSelectedMeal={setSelectedMeal}
              searchMeal={searchMeal}
            />
            <DisplayHistory searchMeal={searchMeal} />
          </>
        ) : (
          renderView()
        )}
      </div>
    </UserProvider>
  );
}

export default App;
