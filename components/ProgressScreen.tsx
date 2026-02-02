'use client';

import { CheckCircle, Circle, Loader2 } from 'lucide-react';
import type { ReportProgress } from '@/lib/types';

interface ProgressScreenProps {
  domain: string;
  progress: ReportProgress;
}

export default function ProgressScreen({ domain, progress }: ProgressScreenProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center px-4">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {progress.progress}%
            </span>
          </div>
        </div>

        {/* Domain */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Analyzing {domain}
        </h2>

        {/* Current Step */}
        <p className="text-gray-600 mb-8">{progress.currentStep}</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.progress}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3 text-left">
          {progress.steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.status === 'completed'
                  ? 'bg-green-50 text-green-700'
                  : step.status === 'running'
                  ? 'bg-primary-50 text-primary-700'
                  : step.status === 'failed'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              {step.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : step.status === 'running' ? (
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              ) : step.status === 'failed' ? (
                <Circle className="w-5 h-5 text-red-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <span className="text-sm font-medium">{step.name}</span>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        <p className="text-sm text-gray-500 mt-8">
          This usually takes 30-60 seconds
        </p>
      </div>
    </div>
  );
}
