import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; 
import { addSearchToHistory } from '../utils/AddSearchHistory';

const MealSearch = ({
  switchView,
  searchTerm,
  setSearchTerm,
  searchResults,
  selectedMeal,
  setSelectedMeal,
  searchMeal, 
}) => {
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [localSelectedMeal, setLocalSelectedMeal] = useState(null);
  const { currentUser } = useUser();
  const userId = currentUser?.uid;

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setLocalSearchResults(data.meals || []);
      setLocalSelectedMeal(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getRecipe = async (mealId) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      const selectedMealData = data.meals[0];

      setLocalSelectedMeal(selectedMealData);

      if (selectedMealData && userId) {
        await addSearchToHistory(userId, selectedMealData.strMeal);
        console.log('Search history updated successfully');
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
    }
  };

  return (
    <div>
  {localSelectedMeal ? (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-6">
          <img
            src={
              localSelectedMeal.strMealThumb.startsWith('http')
                ? localSelectedMeal.strMealThumb
                : `https://www.themealdb.com/images/media/meals/${localSelectedMeal.strMealThumb}/preview`
            }
            alt={localSelectedMeal.strMeal}
            className="img-fluid"
          />
        </div>
        <div className="col-md-6">
          <h2>{localSelectedMeal.strMeal}</h2>
          <h3>Ingredients:</h3>
          <ul>
            {Array.from({ length: 20 }, (_, i) => i + 1)
              .filter((i) => localSelectedMeal[`strIngredient${i}`])
              .map((i) => (
                <li key={i}>
                  {localSelectedMeal[`strMeasure${i}`]} {localSelectedMeal[`strIngredient${i}`]}
                </li>
              ))}
          </ul>
          <button className="btn btn-primary" onClick={() => setLocalSelectedMeal(null)}>Back to Search</button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <h3>Instructions:</h3>
          <p>{localSelectedMeal.strInstructions}</p>
        </div>
      </div>
    </div>
      ) : (
        <div className="container mt-3">
          <h1> Search A Meal</h1>
          <div className="row">
            <div className="col-12">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
                placeholder="Enter meal name..."
              />
              <button className="btn btn-primary mb-3" onClick={handleSearch}>Search</button>
            </div>
          </div>
          <div className="row">
            {localSearchResults.length > 0 ? (
              localSearchResults.map((meal) => (
                <div key={meal.idMeal} className="col-lg-3 col-md-4 col-6 mb-3">
                  <div className="card h-100">
                    <img
                      src={
                        meal.strMealThumb.startsWith('http')
                          ? meal.strMealThumb
                          : `https://www.themealdb.com/images/media/meals/${meal.strMealThumb}/preview`
                      }
                      alt={meal.strMeal}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        <button className="btn btn-link" onClick={() => getRecipe(meal.idMeal)}>
                          {meal.strMeal}
                        </button>
                      </h5>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-12">No meals found. Try searching for something else.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MealSearch;