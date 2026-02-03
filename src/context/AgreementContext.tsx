"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface AgreementData {
  fullName: string
  panNumber: string
  address: string
  city: string
  state: string
  date: string
  jurisdiction: string
  signatureName: string
  signatureDataUrl: string
  hasAgreed: boolean
  downloadLink?: string
  downloadBase64?: string
  uploadWarning?: string
}

interface AgreementContextType {
  data: AgreementData
  updateData: (updates: Partial<AgreementData>) => void
  resetData: () => void
}

const defaultData: AgreementData = {
  fullName: '',
  panNumber: '',
  address: '',
  city: '',
  state: '',
  date: new Date().toISOString().split('T')[0],
  jurisdiction: '',
  signatureName: '',
  signatureDataUrl: '',
  hasAgreed: false,
}

const AgreementContext = createContext<AgreementContextType | undefined>(undefined)

export function AgreementProvider({ children }: { children: ReactNode }): JSX.Element {
  const [data, setData] = useState<AgreementData>(defaultData)

  const updateData = (updates: Partial<AgreementData>): void => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const resetData = (): void => {
    setData(defaultData)
  }

  return (
    <AgreementContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </AgreementContext.Provider>
  )
}

export function useAgreement(): AgreementContextType {
  const context = useContext(AgreementContext)
  if (!context) {
    throw new Error('useAgreement must be used within an AgreementProvider')
  }
  return context
}
