// src/components/Model/SegmentedMuscleModel.tsx
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { Box3, Color, FrontSide, Mesh, MeshStandardMaterial, type Group } from "three";
import type { MuscleGroup } from "@/types/workout";

interface SegmentedMuscleModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  autoRotate?: boolean;
  muscleGroups: MuscleGroup[];
}

const SegmentedMuscleModel: React.FC<SegmentedMuscleModelProps> = ({
  path,
  scale = 1,
  position = [0, 0, 0],
  primaryMuscles = [],
  secondaryMuscles = [],
  autoRotate = true,
  muscleGroups,
}) => {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(path);

  // Create materials for highlighting - memoized to prevent recreation
  const primaryMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color("#ff0000"),
        roughness: 0.8,
        metalness: 0.0,
        emissive: new Color("#ff0000"),
        emissiveIntensity: 0.2,
        transparent: false,
        opacity: 1.0,
      }),
    []
  );

  const secondaryMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color("#ff9900"),
        roughness: 0.8,
        metalness: 0.0,
        emissive: new Color("#ff6600"),
        emissiveIntensity: 0.15,
        transparent: false,
        opacity: 1.0,
      }),
    []
  );

  const defaultMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color("#8c5c3e"),
        roughness: 0.95,
        metalness: 0.0,
        transparent: false,
        opacity: 1.0,
        flatShading: false,
      }),
    []
  );

  // Process the model and apply highlighting
  const model = useMemo(() => {
    const clonedScene = scene.clone();

    // Center the model vertically
    const boundingBox = new Box3().setFromObject(clonedScene);
    const centerY = (boundingBox.max.y + boundingBox.min.y) / 2;
    clonedScene.position.y = -centerY;

    // Collect all mesh names for primary muscles
    const primaryMeshNames = new Set<string>();
    primaryMuscles.forEach((muscleId) => {
      const muscle = muscleGroups.find((m) => m.id === muscleId);
      if (muscle) {
        muscle.mesh_names.forEach((meshName) =>
          primaryMeshNames.add(meshName.toLowerCase())
        );
      }
    });

    // Collect all mesh names for secondary muscles
    const secondaryMeshNames = new Set<string>();
    secondaryMuscles.forEach((muscleId) => {
      const muscle = muscleGroups.find((m) => m.id === muscleId);
      if (muscle) {
        muscle.mesh_names.forEach((meshName) =>
          secondaryMeshNames.add(meshName.toLowerCase())
        );
      }
    });

    // Apply materials to meshes
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        const childName = child.name.toLowerCase();

        if (primaryMeshNames.has(childName)) {
          child.material = primaryMaterial.clone();
        } else if (secondaryMeshNames.has(childName)) {
          child.material = secondaryMaterial.clone();
        } else {
          child.material = defaultMaterial.clone();
        }

        // Ensure proper rendering
        if (child.material) {
          child.material.needsUpdate = true;
          child.material.side = FrontSide;
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
  }, [
    scene,
    primaryMuscles,
    secondaryMuscles,
    muscleGroups,
    primaryMaterial,
    secondaryMaterial,
    defaultMaterial,
  ]);

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
