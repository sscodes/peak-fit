import { useState } from "react";
import { Slider } from "./Slider";

export function SliderExamples() {
  const [continuousValue, setContinuousValue] = useState(50);
  const [discreteValue, setDiscreteValue] = useState(5);
  const [intensityValue, setIntensityValue] = useState(7);
  const [weightValue, setWeightValue] = useState(70);

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {/* Example 1: Basic Continuous Slider */}
      <section>
        <Slider
          min={0}
          max={100}
          value={continuousValue}
          onChange={setContinuousValue}
          label="Medium"
          type="continuous"
        />
        <p className={`caption`}>Selected: {continuousValue.toFixed(1)}</p>
      </section>

      {/* Example 2: Discrete Slider */}
      <section>
        <Slider
          min={0}
          max={10}
          value={discreteValue}
          onChange={setDiscreteValue}
          label="Medium"
          type="discrete"
          step={1}
        />
        <p className={`caption`}>Selected: {discreteValue}</p>
      </section>

      {/* Example 3: Small Size */}
      <section>
        <Slider
          min={1}
          max={10}
          value={intensityValue}
          onChange={setIntensityValue}
          label="Small"
          type="discrete"
          step={1}
          size="small"
        />
      </section>

      {/* Example 4: Large Size */}
      <section>
        <Slider
          min={0}
          max={100}
          value={weightValue}
          onChange={setWeightValue}
          label="Large"
          type="discrete"
          step={10}
          size="large"
        />
      </section>
    </div>
  );
}

/**
 * COMMON USE CASES IN PEAKFIT:
 *
 * 1. Workout Intensity Selection
 *    - 1-10 scale for perceived exertion
 *
 * 2. Rep/Set Ranges
 *    - Set target reps for exercises
 *
 * 3. Weight Selection
 *    - Choose working weight for exercises
 *
 * 4. Rest Time
 *    - Set rest periods between sets
 *
 * 5. Progress Tracking
 *    - Visual representation of goal completion
 *
 * 6. Nutrition Macros
 *    - Adjust protein/carb/fat ratios
 */

export default SliderExamples;
