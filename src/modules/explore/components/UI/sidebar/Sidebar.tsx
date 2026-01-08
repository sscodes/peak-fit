import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import Skeleton from "../../../../../components/skeleton/Skeleton";
import type { Workout } from "../../../../../types/workout";
import classes from "./Sidebar.module.css";

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredWorkouts: Workout[] | undefined;
  selectedWorkout: Workout | null;
  setSelectedWorkout: (workout: Workout) => void;
  isFilterWorkoutsFetching: boolean;
  fetchNextPage: () => void; // Changed from setOffset
  hasMore: boolean;
  isFetchingNextPage: boolean; // Add this for loading state
}

const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  setSearchTerm,
  filteredWorkouts,
  selectedWorkout,
  setSelectedWorkout,
  isFilterWorkoutsFetching,
  fetchNextPage, // Changed from setOffset
  hasMore,
  isFetchingNextPage,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const workoutListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = workoutListRef.current;

    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Call fetchNextPage instead of setOffset
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          fetchNextPage(); // This is the key change
        }
      },
      {
        root: container,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasMore, isFetchingNextPage]); // Updated dependencies

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

      {/* Initial loading state */}
      {isFilterWorkoutsFetching && !filteredWorkouts?.length && (
        <div className={classes.skeletonContainer}>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height="12rem"></Skeleton>
          ))}
        </div>
      )}

      {/* Workout list with ref for scrolling */}
      {filteredWorkouts && filteredWorkouts.length > 0 && (
        <div className={classes.workoutList} ref={workoutListRef}>
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

          {/* Sentinel element for IntersectionObserver */}
          <div ref={sentinelRef} className={classes.sentinel}>
            {isFetchingNextPage && ( // Use isFetchingNextPage instead
              <div className={classes.loadingMore}>
                <Skeleton height="12rem" />
                <Skeleton height="6rem" />
              </div>
            )}
            {!hasMore && filteredWorkouts && filteredWorkouts.length > 0 && (
              <div className={clsx(classes.endMessage, "body-small")}>
                No more workouts
              </div>
            )}
          </div>
        </div>
      )}

      {/* No results state */}
      {filteredWorkouts?.length === 0 && !isFilterWorkoutsFetching && (
        <div className={clsx(classes.noResults, "heading-6")}>
          No workouts found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default Sidebar;
