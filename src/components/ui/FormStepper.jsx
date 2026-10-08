import React from 'react';

export function FormStepper({ steps, activeStep, accessibleStep, disabled, onSelect }) {
  return (
    <nav className="form-stepper" aria-label="Form steps">
      <p className="form-progress" role="status">
        Step {activeStep + 1} of {steps.length} · <strong>{steps[activeStep].title}</strong>
      </p>
      <ol className="form-step-list" style={{ '--form-step-count': steps.length }}>
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              type="button"
              aria-label={`Step ${index + 1}: ${step.title}`}
              aria-current={index === activeStep ? 'step' : undefined}
              disabled={disabled || index > accessibleStep}
              onClick={() => onSelect(index)}
            >
              <span className="form-step-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="form-step-label">{step.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
