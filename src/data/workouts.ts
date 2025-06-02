// src/data/workouts.ts
import { type Workout } from './types';

// Enhanced workout database taking advantage of your detailed muscle segmentation
const workouts: Workout[] = [
  {
    id: 'bench_press',
    name: 'Bench Press',
    description:
      'A compound exercise that targets the chest, shoulders, and triceps.',
    primaryMuscles: ['pecs'],
    secondaryMuscles: ['deltoids', 'triceps'],
    instructions:
      'Lie on a flat bench with a barbell at chest level. Grip the bar slightly wider than shoulder-width. Lower the bar to mid-chest, then press back up to the starting position.',
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    description:
      'A compound lower body exercise that targets the legs and glutes.',
    primaryMuscles: ['quads', 'glutes'],
    secondaryMuscles: ['hamstrings', 'calves', 'abs', 'erector_spinae'],
    instructions:
      'Stand with feet shoulder-width apart, barbell resting on upper back. Bend knees and lower body until thighs are parallel to floor. Return to starting position.',
  },
  {
    id: 'pull_up',
    name: 'Pull-Up',
    description:
      'An upper body compound exercise that targets the back and biceps.',
    primaryMuscles: ['lats', 'biceps'],
    secondaryMuscles: ['forearms', 'traps', 'abs'],
    instructions:
      'Hang from a pull-up bar with palms facing away, hands slightly wider than shoulder-width. Pull your body up until chin is over the bar, then lower back to starting position.',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    description: 'A compound exercise that works the entire posterior chain.',
    primaryMuscles: ['erector_spinae', 'glutes', 'hamstrings'],
    secondaryMuscles: ['lats', 'traps', 'forearms', 'abs'],
    instructions:
      'Stand with feet hip-width apart, barbell over mid-foot. Bend at hips and knees to grip the bar. Drive through heels and hips to lift the bar, keeping it close to your body.',
  },
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    description: 'A standing shoulder press that builds upper body strength.',
    primaryMuscles: ['deltoids'],
    secondaryMuscles: ['triceps', 'abs', 'traps'],
    instructions:
      'Stand with feet shoulder-width apart, barbell at shoulder level. Press the bar straight up overhead until arms are fully extended. Lower back to starting position.',
  },
  {
    id: 'rows',
    name: 'Barbell Rows',
    description: 'A pulling exercise that targets the back muscles.',
    primaryMuscles: ['lats', 'traps'],
    secondaryMuscles: ['biceps', 'forearms', 'deltoids'],
    instructions:
      'Bend forward at the hips with knees slightly bent. Pull the barbell to your lower chest, squeezing shoulder blades together. Lower with control.',
  },
];

export default workouts;
