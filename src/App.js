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
  const [selectedMeal, setSelectedMeal] = useState(null);

  // const searchMeal = async (externalSearchTerm) => {
  //   const termToSearch = externalSearchTerm || searchTerm;
  //   try {
  //     const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termToSearch}`);
  //     const data = await response.json();
  //     const meal = data.meals ? data.meals[0] : null;
  
  //     if (meal) {
  //       const mealDetailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
  //       const mealDetailsData = await mealDetailsResponse.json();
  //       const fullMealDetails = mealDetailsData.meals ? mealDetailsData.meals[0] : null;
  
  //       if (fullMealDetails) {
  //         setSelectedMeal(fullMealDetails);
  //       } else {
  //         console.log("No details found for this meal");
  //       }
  //     } else {
  //       console.log("No meal found for this search term");
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const searchMeal = async (externalSearchTerm) => {
    console.log("External search term:", externalSearchTerm);
    console.log("Component's search term state:", searchTerm);
    const termToSearch = externalSearchTerm || searchTerm;
    console.log("Term to search:", termToSearch); // Adding this to debug
  
    try {
      // Step 1: Search for the meal by name to get its ID
      const searchResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termToSearch}`);
      const searchData = await searchResponse.json();
      const meal = searchData.meals ? searchData.meals[0] : null;
  
      if (meal) {
        // Step 2: Use the meal ID to fetch the full meal details
        const detailsResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
        console.log(`Fetching details from: https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);

        const detailsData = await detailsResponse.json();
        console.log("Search data:", searchData);

        const fullMealDetails = detailsData.meals ? detailsData.meals[0] : null;
  
        if (fullMealDetails) {
          setSelectedMeal(fullMealDetails);
        } else {
          console.log("No details found for this meal");
        }
      } else {
        console.log("No meal found for this search term");
      }
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
            {selectedMeal && (
              <div>
                <h2>{selectedMeal.strMeal}</h2>
                <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
                <p>{selectedMeal.strInstructions}</p>
                {/* Render other details as needed */}
              </div>
            )}
            <DisplayHistory searchMeal={searchMeal} />
          </>
        ) : (
          renderView()
        )}
      </div>
    </UserProvider>
  );
  
        };  

export default App;
  
  