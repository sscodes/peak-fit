// src/components/UI/NoSelectionMessage.tsx
import React from 'react';

const NoSelectionMessage: React.FC = () => {
  return (
    <div className="no-selection-message">
      <h2>Select a workout to view affected muscles</h2>
      <p>Choose from the list on the left to highlight targeted muscle groups</p>
    </div>
  );
};

export default NoSelectionMessage;