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
  searchMeal, // This is passed from App.js
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


  // const searchMeal = async () => {
  //   try {
  //     const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
  //     const data = await response.json();
  //     setSearchResults(data.meals || []);
  //     setSelectedMeal(null);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  return (
    <div>
      {localSelectedMeal ? (
        <div>
          <h2>{localSelectedMeal.strMeal}</h2>
          <img
            src={
              localSelectedMeal.strMealThumb.startsWith('http')
                ? localSelectedMeal.strMealThumb
                : `https://www.themealdb.com/images/media/meals/${localSelectedMeal.strMealThumb}/preview`
            }
            alt={localSelectedMeal.strMeal}
          />
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
          <h3>Instructions:</h3>
          <p>{localSelectedMeal.strInstructions}</p>
          <button onClick={() => setLocalSelectedMeal(null)}>Back to Search</button>
        </div>
      ) : (
        <div>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={() => handleSearch()}>Search</button>
          <div>
            {localSearchResults.length > 0 ? (
              localSearchResults.map((meal) => (
                <div key={meal.idMeal} onClick={() => getRecipe(meal.idMeal)}>
                  <h3>{meal.strMeal}</h3>
                  <img
                    src={
                      meal.strMealThumb.startsWith('http')
                        ? meal.strMealThumb
                        : `https://www.themealdb.com/images/media/meals/${meal.strMealThumb}/preview`
                    }
                    alt={meal.strMeal}
                  />
                </div>
              ))
            ) : (
              <p>No meals found. Try searching for something else.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
  

  
                  };

export default MealSearch;