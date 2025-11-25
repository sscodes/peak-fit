// src/components/UI/NoSelectionMessage.tsx
import React from 'react';
import styles from './NoSelectionMessage.module.css';

const NoSelectionMessage: React.FC = () => {
  return (
    <div className={styles.noSelectionMessage}>
      <h2>Select a workout to view affected muscles</h2>
      <p>
        Choose from the list on the left to highlight targeted muscle groups
      </p>
    </div>
  );
};

export default NoSelectionMessage;
