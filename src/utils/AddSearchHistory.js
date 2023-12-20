import { getFirestore, doc, updateDoc, arrayUnion } from 'firebase/firestore';

const addSearchToHistory = async (userId, searchTerm) => {
  if (!userId) {
    throw new Error('No userId provided for addSearchToHistory');
  }
  const db = getFirestore();
  const searchHistoryRef = doc(db, 'SearchHistory', userId);

  try {
    await updateDoc(searchHistoryRef, {
      history: arrayUnion(searchTerm)
    });

    console.log('Search added to history:', searchTerm);
  } catch (error) {
    console.error('Error adding search to history:', error);
  }
};

export { addSearchToHistory };