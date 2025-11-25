// src/components/Model/DetailedMuscleModel.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';

interface DetailedMuscleModelProps {
  path: string;
  scale?: number;
  position?: [number, number, number];
  workoutId: string | null;
  autoRotate?: boolean;
}

// Define a type for detailed muscle information
interface MuscleRegion {
  name: string;
  style: React.CSSProperties;
  isPrimary: boolean;
}

// This solution provides detailed muscle region highlighting
const DetailedMuscleModel: React.FC<DetailedMuscleModelProps> = ({ 
  path, 
  scale = 1, 
  position = [0, 0, 0],
  workoutId,
  autoRotate = true
}) => {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(path);
  
  // Auto-rotate the model if enabled
  useFrame((state) => {
    if (group.current && autoRotate) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Get detailed muscle regions based on the workout
  const getMuscleRegions = (): MuscleRegion[] => {
    if (!workoutId) return [];
    
    switch (workoutId) {
      case 'bench_press': 
        return [
          // Primary Muscles - Chest
          {
            name: "Upper Pectorals",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '140px', 
              height: '35px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '50px',
              left: '130px',
              top: '140px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              transform: 'rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Middle Pectorals",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '150px', 
              height: '45px',
              background: 'rgba(255, 0, 0, 0.45)',
              borderRadius: '70px',
              left: '125px',
              top: '165px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2.2s infinite alternate',
              transform: 'rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Lower Pectorals",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '140px', 
              height: '35px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '70px',
              left: '130px',
              top: '195px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              transform: 'rotate(0deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Shoulders
          {
            name: "Anterior Deltoid",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '55px', 
              height: '35px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '50%',
              left: '70px',
              top: '150px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Anterior Deltoid",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '55px', 
              height: '35px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '50%',
              left: '275px',
              top: '150px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Triceps
          {
            name: "Lateral Triceps",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '45px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '40px',
              top: '185px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Long Head",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '40px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '35px',
              top: '225px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Lateral Triceps",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '45px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '320px',
              top: '185px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Long Head",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '40px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '325px',
              top: '225px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }
        ];
        
      case 'squat': 
        return [
          // Primary Muscles - Quads
          {
            name: "Vastus Lateralis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '45px', 
              height: '130px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '30px',
              left: '125px',
              top: '380px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Vastus Medialis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '45px', 
              height: '130px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '30px',
              left: '175px',
              top: '380px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Rectus Femoris",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '35px', 
              height: '120px',
              background: 'rgba(255, 0, 0, 0.45)',
              borderRadius: '30px',
              left: '150px',
              top: '360px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Vastus Lateralis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '45px', 
              height: '130px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '30px',
              left: '230px',
              top: '380px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Vastus Medialis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '45px', 
              height: '130px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '30px',
              left: '280px',
              top: '380px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Rectus Femoris",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '35px', 
              height: '120px',
              background: 'rgba(255, 0, 0, 0.45)',
              borderRadius: '30px',
              left: '255px',
              top: '360px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Primary Muscles - Glutes
          {
            name: "Gluteus Maximus",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '60px', 
              height: '60px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '50%',
              left: '140px',
              top: '300px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Gluteus Maximus",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '60px', 
              height: '60px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '50%',
              left: '200px',
              top: '300px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Abs
          {
            name: "Rectus Abdominis",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '70px', 
              height: '100px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '165px',
              top: '180px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Calves
          {
            name: "Gastrocnemius",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '35px', 
              height: '70px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '135px',
              top: '520px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Gastrocnemius",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '35px', 
              height: '70px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '30px',
              left: '230px',
              top: '520px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Soleus",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '40px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '135px',
              top: '575px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Soleus",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '40px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '230px',
              top: '575px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }
        ];
        
      case 'pull_up': 
        return [
          // Primary Muscles - Back/Lats
          {
            name: "Latissimus Dorsi",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '70px', 
              height: '100px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '105px',
              top: '180px',
              transform: 'skew(-5deg)',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Latissimus Dorsi",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '70px', 
              height: '100px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '225px',
              top: '180px',
              transform: 'skew(5deg)',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Teres Major",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '30px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '120px',
              top: '155px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Teres Major",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '30px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '240px',
              top: '155px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Primary Muscles - Biceps
          {
            name: "Biceps Brachii",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '70px',
              background: 'rgba(255, 0, 0, 0.45)',
              borderRadius: '30px',
              left: '70px',
              top: '195px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Brachialis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '40px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '75px',
              top: '240px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Biceps Brachii",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '40px', 
              height: '70px',
              background: 'rgba(255, 0, 0, 0.45)',
              borderRadius: '30px',
              left: '290px',
              top: '195px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Brachialis",
            isPrimary: true,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '40px',
              background: 'rgba(255, 0, 0, 0.4)',
              borderRadius: '20px',
              left: '295px',
              top: '240px',
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.6)',
              animation: 'pulse-primary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Forearms
          {
            name: "Brachioradialis",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '60px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '75px',
              top: '280px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          {
            name: "Brachioradialis",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '30px', 
              height: '60px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '295px',
              top: '280px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 2.2s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          },
          
          // Secondary Muscles - Core
          {
            name: "Rectus Abdominis",
            isPrimary: false,
            style: {
              position: 'absolute',
              width: '60px', 
              height: '90px',
              background: 'rgba(255, 153, 0, 0.4)',
              borderRadius: '20px',
              left: '170px',
              top: '190px',
              boxShadow: '0 0 10px rgba(255, 153, 0, 0.6)',
              animation: 'pulse-secondary 1.8s infinite alternate',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '9px',
              color: 'white',
              textShadow: '0 0 3px black',
              fontWeight: 'bold',
              whiteSpace: 'nowrap'
            }
          }
        ];
        
      default:
        return [];
    }
  };

  // Clone and prepare the model
  const clonedScene = React.useMemo(() => {
    return scene.clone();
  }, [scene]);

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {/* The actual model */}
      <primitive object={clonedScene} />
      
      {/* Detailed muscle overlays */}
      {workoutId && (
        <Html
          center
          position={[0, 0, 0]}
          className="muscle-highlights-container"
          occlude
        >
          <div style={{
            position: 'relative',
            width: '400px',
            height: '800px',
            pointerEvents: 'none',
          }}>
            {getMuscleRegions().map((region, index) => (
              <div 
                key={`${region.name}-${index}`} 
                style={region.style}
              >
                {region.name}
              </div>
            ))}
          </div>
        </Html>
      )}
    </group>
  );
};

export default DetailedMuscleModel;