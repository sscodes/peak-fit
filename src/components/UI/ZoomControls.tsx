// src/components/UI/ZoomControls.tsx
import React from 'react';
import * as THREE from 'three';

const ZoomControls: React.FC = () => {
  const handleZoomIn = () => {
    const camera = document.querySelector('canvas')?.['__r3f']?.camera;
    if (camera) {
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(direction, 2);
    }
  };

  const handleZoomOut = () => {
    const camera = document.querySelector('canvas')?.['__r3f']?.camera;
    if (camera) {
      const direction = new THREE.Vector3(0, 0, -1);
      direction.applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(direction, -2);
    }
  };
  
  const handleResetView = () => {
    const controls = document.querySelector('canvas')?.['__r3f']?.controls;
    const camera = document.querySelector('canvas')?.['__r3f']?.camera;
    
    if (controls && camera) {
      // Reset camera position to show the full body (more zoomed out)
      camera.position.set(0, 0, 26);
      
      // Set narrower FOV for more zoomed out appearance
      camera.fov = 28;
      camera.updateProjectionMatrix();
      
      camera.lookAt(0, 0, 0);
      
      // Reset controls target and update
      controls.target.set(0, 0, 0);
      controls.update();
    }
  };

  return (
    <div className="zoom-controls">
      <button className="zoom-button" onClick={handleZoomIn} title="Zoom In">+</button>
      <button className="zoom-button" onClick={handleZoomOut} title="Zoom Out">−</button>
      <button className="zoom-button reset-button" onClick={handleResetView} title="Reset View">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
      </button>
    </div>
  );
};

export default ZoomControls;