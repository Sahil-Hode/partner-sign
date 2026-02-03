"use client"

import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps): JSX.Element {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 ${
          error ? 'border-red-400' : 'border-slate-300'
        } ${className}`.trim()}
        {...props}
      />
      {error && <span className="text-sm text-red-600 mt-1 block">{error}</span>}
    </label>
  )
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function FormTextarea({ label, error, className = '', ...props }: FormTextareaProps): JSX.Element {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300 ${
          error ? 'border-red-400' : 'border-slate-300'
        } ${className}`.trim()}
        rows={4}
        {...props}
      />
      {error && <span className="text-sm text-red-600 mt-1 block">{error}</span>}
    </label>
  )
}
