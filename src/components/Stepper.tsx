"use client"

import React from 'react'

interface StepperProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export function Stepper({ currentStep, totalSteps, steps }: StepperProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-3 justify-center">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        const isComplete = stepNumber < currentStep
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                isComplete
                  ? 'bg-emerald-600 text-white'
                  : isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {stepNumber}
            </div>
            <span className={`text-sm ${isActive ? 'font-semibold text-slate-900' : 'text-slate-600'}`}> 
              {label}
            </span>
            {stepNumber < totalSteps && <span className="text-slate-300">/</span>}
          </div>
        )
      })}
    </div>
  )
}
