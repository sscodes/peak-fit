// src/components/Canvas/index.tsx
import React, { Suspense, type ReactNode, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Html, 
  BakeShadows, 
  Center
} from '@react-three/drei';
import * as THREE from 'three';

import CameraSetup from './CameraSetup';
import EnhancedLighting from './EnhancedLighting';

interface SceneProps {
  children: ReactNode;
  showLightHelpers?: boolean;
}

const Scene: React.FC<SceneProps> = ({ children, showLightHelpers = false }) => {
  // Debug state for showing light helpers
  const [debug] = useState(showLightHelpers);
  
  return (
    <Canvas 
      shadows={false}
      dpr={[1, 2]} 
      camera={{ 
        position: [0, 0, 26], // Even farther back to show more zoomed out view
        fov: 28,             // Narrower FOV for more zoomed out appearance
        near: 0.1,
        far: 1000 
      }}
      gl={{ 
        antialias: true,
        alpha: false,
        outputColorSpace: THREE.SRGBColorSpace,
        depth: true,
        logarithmicDepthBuffer: true,
        physicallyCorrectLights: true
      }}
    >
      {/* Environment and lighting */}
      <color attach="background" args={['#12121e']} />
      <EnhancedLighting showHelpers={debug} />
      <Environment preset="studio" background={false} />
      
      {/* Model with loading fallback */}
      <Suspense fallback={
        <Html center>
          <div style={{ color: 'white', background: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '5px' }}>
            Loading 3D Model...
          </div>
        </Html>
      }>
        <Center position={[0, 0, 0]}>
          {children}
        </Center>
        <BakeShadows />
      </Suspense>
      
      {/* Orbit controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={15}      // Increased minimum distance to prevent zooming in too close
        maxDistance={40}      // Allow zooming out more to see full body
        dampingFactor={0.05}
        autoRotate={false}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        target={[0, 0, 0]}    // Center the controls on the model
      />
    </Canvas>
  );
};

export default Scene;