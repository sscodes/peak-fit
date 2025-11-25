// src/components/Canvas/CameraSetup.tsx
import { useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';

const CameraSetup: React.FC = () => {
  const { camera, size } = useThree();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run this once
    if (!initialized.current) {
      // Set camera position to show full body with much more zoom out
      const aspect = size.width / size.height;

      if (aspect > 1) {
        // Landscape - position much farther back to see full body
        camera.position.set(0, 0, 26);
      } else {
        // Portrait - position even farther back
        camera.position.set(0, 0, 32);
      }

      // Narrower field of view for more zoomed out appearance
      camera.fov = 28;
      camera.updateProjectionMatrix();

      camera.lookAt(0, 0, 0);
      initialized.current = true;
    }
  }, [camera, size]);

  return null;
};

export default CameraSetup;
