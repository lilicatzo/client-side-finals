import React, { useState, useEffect } from 'react';
import { UserProvider } from './context/UserContext';
import MealSearch from './components/MealSearch';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { auth } from './config/FirebaseConfig';
import DisplayHistory from './components/DisplayHistory';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar'; 


function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('signIn');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const searchMeal = async (externalSearchTerm) => {
    console.log("External search term:", externalSearchTerm);
    console.log("Component's search term state:", searchTerm);
    const termToSearch = externalSearchTerm || searchTerm;
    console.log("Term to search:", termToSearch); 
    setSelectedMeal(null);
  
    try {
      const searchResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${termToSearch}`);
      const searchData = await searchResponse.json();
      const meal = searchData.meals ? searchData.meals[0] : null;
  
      if (meal) {
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

  const renderProfile = () => {
    return (
      <div>
        <p></p>
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
      <NavigationBar />
      <div className="container-fluid">
        {user ? (
          <div className="row vh-100" style={{ marginTop: '100px' }}>
            <div className="col-md-3 d-flex flex-column ">
              <DisplayHistory searchMeal={searchMeal} />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-12">{renderProfile()}</div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <MealSearch
                    switchView={switchView}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    searchResults={searchResults}
                    selectedMeal={selectedMeal}
                    setSelectedMeal={setSelectedMeal}
                    searchMeal={searchMeal}
                  />
                </div>
              </div>
              {selectedMeal && (
                <div className="row">
                  <div className="col-md-12">
                    <h1>{selectedMeal.strMeal}</h1>
                    <div className="col-md-6">
                      <img
                        src={selectedMeal.strMealThumb}
                        alt={selectedMeal.strMeal}
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-md-6">
                      <h3>Ingredients:</h3>
                      <ul>
                        {Array.from({ length: 20 }, (_, i) => i + 1)
                          .filter((i) => selectedMeal[`strIngredient${i}`])
                          .map((i) => (
                            <li key={i}>
                              {selectedMeal[`strMeasure${i}`]}{' '}
                              {selectedMeal[`strIngredient${i}`]}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="col-md-12">
                      <h3>Instructions:</h3>
                      <p>{selectedMeal.strInstructions}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setSelectedMeal(null)}
                      >
                        Back to Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="row">
                <div className="col-md-12">
                  <DisplayHistory searchMeal={searchMeal} />
                </div>
              </div> */}
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12">{renderView()}</div>
          </div>
        )}
      </div>
    </UserProvider>
  );
}

export default App;