"use client"

import React from 'react'

export function AgreementCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {children}
    </div>
  )
}

export function AgreementHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
      {children}
    </div>
  )
}

export function AgreementBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-6 ${className}`.trim()}>
      {children}
    </div>
  )
}

export function AgreementFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 border-t border-slate-200 bg-slate-50">
      {children}
    </div>
  )
}
