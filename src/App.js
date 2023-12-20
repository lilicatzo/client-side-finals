import React, { useState } from 'react';
import MealSearch from './components/MealSearch';

function App() {
  const [view, setView] = useState('search');

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="App">
      {view === 'search' && <MealSearch switchView={switchView} />}
    </div>
  );
}

export default App;



