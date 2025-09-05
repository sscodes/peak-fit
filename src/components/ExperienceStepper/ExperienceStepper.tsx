import React, { useState } from 'react';
import './ExperienceStepper.css';

const ExperienceStepper = () => {
  // Sample experience data - you can replace this with your own
  const experiences = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Corp",
      period: "2022 - Present",
      description: "Led the development of multiple React applications, implemented design systems, and mentored junior developers.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      achievements: [
        "Reduced load time by 40% through optimization",
        "Built reusable component library used across 5 projects",
        "Mentored 3 junior developers"
      ]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      period: "2020 - 2022",
      description: "Developed and maintained full-stack applications using MERN stack. Collaborated closely with design and product teams.",
      skills: ["Node.js", "MongoDB", "Express", "React"],
      achievements: [
        "Launched 2 major features that increased user engagement by 25%",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Led migration from monolith to microservices"
      ]
    },
    {
      id: 3,
      title: "Junior Developer",
      company: "Digital Agency",
      period: "2018 - 2020",
      description: "Started my professional journey building websites and web applications for various clients.",
      skills: ["JavaScript", "HTML/CSS", "WordPress", "PHP"],
      achievements: [
        "Delivered 15+ client projects on time",
        "Learned React and modern development practices",
        "Received 'Rising Star' award in 2019"
      ]
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % experiences.length);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const currentExperience = experiences[currentStep];

  return (
    <div className="stepper-container">
      {/* Progress Indicators */}
      <div className="progress-indicators">
        {experiences.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`progress-dot ${index === currentStep ? 'active' : 'inactive'}`}
            aria-label={`Go to experience ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="content-card">
        <div className="content-header">
          <div className="header-info">
            <h2 className="job-title">
              {currentExperience.title}
            </h2>
            <h3 className="company-name">
              {currentExperience.company}
            </h3>
            <p className="period">
              {currentExperience.period}
            </p>
          </div>
          <div className="step-indicator">
            {currentStep + 1} / {experiences.length}
          </div>
        </div>

        <p className="description">
          {currentExperience.description}
        </p>

        {/* Skills */}
        <div className="skills-section">
          <h4 className="section-title">Technologies Used:</h4>
          <div className="skills-container">
            {currentExperience.skills.map((skill, index) => (
              <span
                key={index}
                className="skill-tag"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h4 className="section-title">Key Achievements:</h4>
          <ul className="achievements-list">
            {currentExperience.achievements.map((achievement, index) => (
              <li key={index} className="achievement-item">
                <span className="achievement-bullet">•</span>
                <span className="achievement-text">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="navigation">
        <button
          onClick={handlePrev}
          className="nav-button prev"
          aria-label="Previous experience"
        >
          <span>Previous</span>
        </button>

        <div className="nav-center">
          <span className="company-indicator">{currentExperience.company}</span>
        </div>

        <button
          onClick={handleNext}
          className="nav-button next"
          aria-label="Next experience"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceStepper;