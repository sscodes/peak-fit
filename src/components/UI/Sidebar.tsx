// src/components/UI/Sidebar.tsx
import React from 'react';
import { type Workout } from '../../data/types';

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredWorkouts: Workout[];
  selectedWorkout: Workout | null;
  setSelectedWorkout: (workout: Workout) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  setSearchTerm,
  filteredWorkouts,
  selectedWorkout,
  setSelectedWorkout
}) => {
  return (
    <div className="sidebar">
      <h2>Workout Selector</h2>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search workouts..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="workout-list">
        {filteredWorkouts.map(workout => (
          <div 
            key={workout.id}
            className={`workout-item ${selectedWorkout?.id === workout.id ? 'selected' : ''}`}
            onClick={() => setSelectedWorkout(workout)}
          >
            <h3>{workout.name}</h3>
            <p>{workout.description}</p>
          </div>
        ))}
      </div>
      
      {filteredWorkouts.length === 0 && (
        <div className="no-results">
          No workouts found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Sidebar;