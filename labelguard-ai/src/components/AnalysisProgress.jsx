import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

const steps = [
  { name: 'Reading label', duration: 800 },
  { name: 'Extracting text', duration: 1000 },
  { name: 'Identifying declarations', duration: 800 },
  { name: 'Running compliance checks', duration: 600 },
  { name: 'Preparing report', duration: 400 }
];

export default function AnalysisProgress({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let timeouts = [];

    const runSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        
        await new Promise(resolve => {
          const timeout = setTimeout(() => {
            setCompletedSteps(prev => [...prev, i]);
            resolve();
          }, steps[i].duration);
          timeouts.push(timeout);
        });
      }

      // Small delay before completion
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    };

    runSteps();

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-navy-900">
            Analyzing Label
          </h3>
          <p className="text-sm text-navy-600 mt-2">
            Please wait while we process your product label
          </p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isPending = !isCompleted && !isCurrent;

            return (
              <div
                key={step.name}
                className={`flex items-center space-x-3 transition-all ${
                  isPending ? 'opacity-50' : 'opacity-100'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrent
                    ? 'bg-brand-600 animate-pulse'
                    : 'bg-gray-200'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-white" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${
                      isCurrent ? 'bg-white' : 'bg-gray-400'
                    }`} />
                  )}
                </div>

                <span className={`text-sm font-medium ${
                  isCompleted || isCurrent
                    ? 'text-navy-900'
                    : 'text-navy-500'
                }`}>
                  {step.name}
                </span>

                {isCurrent && (
                  <Loader2 className="h-4 w-4 text-brand-600 animate-spin ml-auto" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-500 ease-out"
              style={{
                width: `${(completedSteps.length / steps.length) * 100}%`
              }}
            />
          </div>
          <p className="text-xs text-navy-500 mt-2 text-center">
            Step {Math.min(currentStep + 1, steps.length)} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}
