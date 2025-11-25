// src/components/Model/SegmentedMuscleModel.tsx
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

import muscleGroups from '../../../../../data/muscleGroups';

interface SegmentedMuscleModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  autoRotate?: boolean;
}

const SegmentedMuscleModel: React.FC<SegmentedMuscleModelProps> = ({
  path,
  scale = 1,
  position = [0, 0, 0],
  primaryMuscles = [],
  secondaryMuscles = [],
  autoRotate = true,
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);

  // Create materials for highlighting - made more matte
  const primaryMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff0000'), // Bright red
    roughness: 0.8, // Increased roughness for matte finish
    metalness: 0.0, // Removed metalness for non-reflective surface
    emissive: new THREE.Color('#ff0000'),
    emissiveIntensity: 0.2, // Reduced emissive intensity
    transparent: false,
    opacity: 1.0,
  });

  const secondaryMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff9900'), // Orange
    roughness: 0.8, // Increased roughness for matte finish
    metalness: 0.0, // Removed metalness for non-reflective surface
    emissive: new THREE.Color('#ff6600'),
    emissiveIntensity: 0.15, // Reduced emissive intensity
    transparent: false,
    opacity: 1.0,
  });

  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8c5c3e'),
    roughness: 0.95, // Very high roughness to eliminate shine
    metalness: 0.0, // No metalness
    transparent: false,
    opacity: 1.0,
    flatShading: false, // Keep smooth shading but reduce reflectivity
  });

  // Process the model and apply highlighting
  const model = useMemo(() => {
    const clonedScene = scene.clone();

    // Center the model vertically
    let boundingBox = new THREE.Box3().setFromObject(clonedScene);
    let centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
    clonedScene.position.y = -centerY;

    // Log all mesh names for debugging
    console.log('Available meshes in segmented model:');
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(`- ${child.name}`);
      }
    });

    // Function to check if a mesh name matches any muscle pattern
    const checkMeshName = (
      meshName: string,
      muscleNames: string[]
    ): boolean => {
      const lowerName = meshName.toLowerCase();
      return muscleNames.some((name) => lowerName.includes(name.toLowerCase()));
    };

    // Apply materials to meshes
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const childName = child.name.toLowerCase();

        // Check if this mesh corresponds to a primary muscle
        const isPrimaryMuscle = primaryMuscles.some((muscleId) => {
          const muscle = muscleGroups.find((m) => m.id === muscleId);
          return muscle ? checkMeshName(childName, muscle.meshNames) : false;
        });

        // Check if this mesh corresponds to a secondary muscle
        const isSecondaryMuscle = secondaryMuscles.some((muscleId) => {
          const muscle = muscleGroups.find((m) => m.id === muscleId);
          return muscle ? checkMeshName(childName, muscle.meshNames) : false;
        });

        // Apply appropriate material
        if (isPrimaryMuscle) {
          child.material = primaryMaterial.clone();
          console.log(`Applied PRIMARY highlight to: ${child.name}`);
        } else if (isSecondaryMuscle && !isPrimaryMuscle) {
          child.material = secondaryMaterial.clone();
          console.log(`Applied SECONDARY highlight to: ${child.name}`);
        } else {
          child.material = defaultMaterial.clone();
        }

        // Ensure proper rendering
        if (child.material) {
          child.material.needsUpdate = true;
          child.material.side = THREE.FrontSide;
          child.material.depthWrite = true;
          child.material.depthTest = true;
        }

        // Improve geometry for better shading
        if (child.geometry) {
          child.geometry.computeVertexNormals();
          if (child.geometry.attributes.normal) {
            child.geometry.attributes.normal.needsUpdate = true;
          }
        }
      }
    });

    return clonedScene;
  }, [scene, primaryMuscles, secondaryMuscles]);

  // Auto-rotate the model
  useFrame((state) => {
    if (group.current && autoRotate) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      <primitive object={model} />
    </group>
  );
};

export default SegmentedMuscleModel;
