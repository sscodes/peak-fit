// src/hooks/useFilteredWorkouts.ts
import { useState, useEffect } from 'react';
import { type Workout } from '../data/types';

const useFilteredWorkouts = (workouts: Workout[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts);
  
  // Filter workouts based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredWorkouts(workouts);
    } else {
      const lowerCaseSearch = searchTerm.toLowerCase();
      setFilteredWorkouts(workouts.filter(workout => 
        workout.name.toLowerCase().includes(lowerCaseSearch) ||
        workout.description.toLowerCase().includes(lowerCaseSearch)
      ));
    }
  }, [searchTerm, workouts]);
  
  return { searchTerm, setSearchTerm, filteredWorkouts };
};

export default useFilteredWorkouts;