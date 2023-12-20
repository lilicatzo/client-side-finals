import { getFirestore, doc, setDoc } from 'firebase/firestore';

const createInitialSearchHistory = async (userId) => {
  console.log('Received user ID:', userId);
  const db = getFirestore();

  const initialData = {
    userId: userId,
    history: []
  };

  try {
    await setDoc(doc(db, 'SearchHistory', userId), initialData);
    console.log('Initial search history added for user:', userId);
  } catch (error) {
    console.error('Error adding initial search history:', error);
  }
};

export { createInitialSearchHistory };
