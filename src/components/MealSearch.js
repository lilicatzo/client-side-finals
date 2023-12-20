import React, { useState } from 'react';
import { useUser } from '../context/UserContext'; 
import { addSearchToHistory } from '../utils/AddSearchHistory';

const MealSearch = ({ switchView}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const { currentUser } = useUser();
  const userId = currentUser?.uid;

  const searchMeal = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.meals || []);
      setSelectedMeal(null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getRecipe = async (mealId) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const data = await response.json();
      const selectedMealData = data.meals[0];

      setSelectedMeal(selectedMealData);

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
      {selectedMeal ? (
        <div>
          <h2>{selectedMeal.strMeal}</h2>
          <img
            src={
                selectedMeal.strMealThumb.startsWith('http')
                ? selectedMeal.strMealThumb
                : `https://www.themealdb.com/images/media/meals/${selectedMeal.strMealThumb}/preview`
            }
            alt={selectedMeal.strMeal}
            />
          <h3>Ingredients:</h3>
          <ul>
            {Array.from({ length: 20 }, (_, i) => i + 1)
              .filter((i) => selectedMeal[`strIngredient${i}`])
              .map((i) => (
                <li key={i}>
                  {selectedMeal[`strMeasure${i}`]} {selectedMeal[`strIngredient${i}`]}
                </li>
              ))}
          </ul>
          <h3>Recipe:</h3>
          <p>{selectedMeal.strInstructions}</p>
          <button onClick={() => setSelectedMeal(null)}>Back to Search</button>
        </div>
      ) : (
        <div>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={() => searchMeal()}>Search</button>
          <div>
          {searchResults.map((meal) => (
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
))}

          </div>
        </div>
      )}
    </div>

  );
};

export default MealSearch;