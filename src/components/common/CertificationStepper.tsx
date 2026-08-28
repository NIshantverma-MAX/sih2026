import React from 'react';
import { Check } from 'lucide-react';
import { CertificationStep } from '../../types';
import { cn } from '../../utils/helpers';

export interface CertificationStepperProps {
  steps: CertificationStep[];
  activeStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const CertificationStepper: React.FC<CertificationStepperProps> = ({
  steps,
  activeStep,
  onStepClick
}) => {
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="flex items-center min-w-max px-4">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          
          return (
            <React.Fragment key={step.step}>
              {/* Step Circle */}
              <div 
                className="relative flex flex-col items-center group cursor-pointer"
                onClick={() => onStepClick?.(index)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors bg-white",
                  isActive ? "border-blue-900 text-blue-900" : 
                  isCompleted ? "border-green-500 bg-green-50 text-green-600" : 
                  "border-gray-300 text-gray-400 group-hover:border-gray-400"
                )}>
                  {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                </div>
                <div className="absolute top-12 w-32 text-center">
                  <p className={cn(
                    "text-xs font-semibold leading-tight",
                    isActive ? "text-blue-900" : 
                    isCompleted ? "text-gray-900" : "text-gray-500"
                  )}>
                    {step.title}
                  </p>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-16 h-0.5 mx-2 -mt-8",
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer for absolute positioned labels */}
      <div className="h-12 w-full"></div>
    </div>
  );
};