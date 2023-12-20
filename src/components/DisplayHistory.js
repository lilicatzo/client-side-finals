import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { firestore } from '../config/FirebaseConfig';

const HistoryComponent = ({ searchMeal }) => {
  const { currentUser } = useUser();
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (currentUser) {
          const historyRef = collection(firestore, 'SearchHistory');
          const q = query(historyRef, where('userId', '==', currentUser.uid));

          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            const historyArray = snapshot.docs[0].data().history;
            setHistoryData(historyArray);
          } else {
            console.log('No history found for this user');
          }
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [currentUser]);

  return (
    <div>
      <h2>Search History</h2>
      <ul>
        {historyData.map((searchTerm, index) => (
          <li key={index} onClick={() => searchMeal(searchTerm)}>
            {searchTerm}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryComponent;
