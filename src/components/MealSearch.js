import React, { useState, useEffect } from 'react';

const MealSearch = ({ switchView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const searchMeal = async () => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      const data = await response.json();
      setSearchResults(data.meals || []); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchMeal();
    }
  }, [searchTerm]);

  return (
    <div>
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={() => searchMeal()}>Search</button>
      <div>
        {searchResults.map((meal) => (
          <div key={meal.idMeal}>
            <h3>{meal.strMeal}</h3>
            {}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealSearch;
