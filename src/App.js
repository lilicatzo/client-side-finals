import React from 'react';
import MealSearch from './components/MealSearch';
fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772')
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error fetching meal details:', error));

function App() {
  const [view, setView] = React.useState('search');

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="App">
      <h1>Meal Search Platform</h1>
      <MealSearch switchView={switchView} />
    </div>
  );
}

export default App;


