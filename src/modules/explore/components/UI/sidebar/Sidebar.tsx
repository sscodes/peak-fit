import React from "react";
import type { Workout } from "../../../../../types/workout";
import classes from "./Sidebar.module.css";
import clsx from "clsx";

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
    <div className={classes.sidebar}>
      <h2 className="heading-2">Explore</h2>
      <div className={classes.searchContainer}>
        <input
          type="text"
          placeholder="Search workouts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={clsx(classes.searchInput, "input-text")}
        />
      </div>

      {filteredWorkouts.length > 0 && (
        <div className={classes.workoutList}>
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className={`${classes.workoutItem} ${
                selectedWorkout?.id === workout.id ? classes.selected : ""
              }`}
              onClick={() => setSelectedWorkout(workout)}
            >
              <h3 className={clsx(classes.workoutName, "heading-4")}>
                {workout.name}
              </h3>
              <p className="body-regular">{workout.description}</p>
            </div>
          ))}
        </div>
      )}

      {filteredWorkouts.length === 0 && (
        <div className={clsx(classes.noResults, "heading-6")}>
          No workouts found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Sidebar;
