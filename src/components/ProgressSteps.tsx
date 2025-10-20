import { Check } from 'lucide-react';
import { AppStep } from '../lib/types';

interface ProgressStepsProps {
  currentStep: AppStep;
}

const steps: { id: AppStep; label: string; number: number }[] = [
  { id: 'upload', label: 'Upload', number: 1 },
  { id: 'map', label: 'Map Columns', number: 2 },
  { id: 'validate', label: 'Validate', number: 3 },
  { id: 'visualize', label: 'Visualize', number: 4 }
];

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  transition-all duration-200
                  ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                  ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${!isCompleted && !isCurrent ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check size={20} /> : step.number}
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium
                  ${isCurrent ? 'text-blue-600' : ''}
                  ${isCompleted ? 'text-emerald-600' : ''}
                  ${!isCompleted && !isCurrent ? 'text-gray-500' : ''}
                `}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-4 rounded transition-all duration-200
                  ${index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
