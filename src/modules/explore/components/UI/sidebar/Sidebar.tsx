// src/components/UI/Sidebar.tsx
import React from 'react';
import type { Workout } from '../../../../../data/types';
import styles from './Sidebar.module.css';

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
  setSelectedWorkout,
}) => {
  return (
    <div className={styles.sidebar}>
      <h2>Workout Selector</h2>
      <div className={styles.searchContainer}>
        <input
          type='text'
          placeholder='Search workouts...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.workoutList}>
        {filteredWorkouts.map((workout) => (
          <div
            key={workout.id}
            className={`${styles.workoutItem} ${
              selectedWorkout?.id === workout.id ? styles.selected : ''
            }`}
            onClick={() => setSelectedWorkout(workout)}
          >
            <h3>{workout.name}</h3>
            <p>{workout.description}</p>
          </div>
        ))}
      </div>

      {filteredWorkouts.length === 0 && (
        <div className={styles.noResults}>
          No workouts found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Sidebar;
