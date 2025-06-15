// src/components/Canvas/EnhancedLighting.tsx
import React from 'react';

interface EnhancedLightingProps {
  showHelpers?: boolean;
}

const EnhancedLighting: React.FC<EnhancedLightingProps> = ({ showHelpers = false }) => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} />
      
      {/* Key light - front */}
      <directionalLight
        position={[0, 2, 5]}
        intensity={0.8}
        castShadow={false}
      />
      
      {/* Fill light - left */}
      <directionalLight
        position={[-5, 1, 2]}
        intensity={0.4}
        castShadow={false}
      />
      
      {/* Fill light - right */}
      <directionalLight
        position={[5, 1, 2]}
        intensity={0.4}
        castShadow={false}
      />
      
      {/* Back light for rim lighting */}
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.3}
        castShadow={false}
      />
      
      {/* Top light for better definition */}
      <directionalLight
        position={[0, 5, 0]}
        intensity={0.4}
        castShadow={false}
      />
      
      {/* Bottom fill light */}
      <directionalLight
        position={[0, -3, 0]}
        intensity={0.2}
        castShadow={false}
      />
      
      {/* Add a soft point light in the center for volumetric effect */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.2}
        distance={10}
        decay={2}
      />
    </>
  );
};

export default EnhancedLighting;