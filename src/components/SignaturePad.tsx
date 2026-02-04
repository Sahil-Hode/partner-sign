"use client"

import React, { useEffect, useRef, useState } from 'react'

interface SignaturePadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  disabledMessage?: string
}

export function SignaturePad({ value, onChange, disabled = false, disabledMessage }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (!value || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = value
  }, [value])

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#111827'
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
    setIsDrawing(true)
  }

  const draw = (e: React.PointerEvent<HTMLCanvasElement>): void => {
    if (disabled) return
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const endDrawing = (): void => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    setIsDrawing(false)
    onChange(canvas.toDataURL('image/png'))
  }

  const handleClear = (): void => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white p-3 relative">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Sign inside the box</span>
          <span className="flex items-center gap-1">
            <span className="inline-block">⇢</span>
            Drag to sign
          </span>
        </div>
        <canvas
          ref={canvasRef}
          width={900}
          height={260}
          className={`w-full h-48 sm:h-56 md:h-60 touch-none ${disabled ? 'opacity-60 pointer-events-none' : ''}`.trim()}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
        />
        {disabled && (
          <div className="absolute inset-3 rounded-md bg-white/60 flex items-center justify-center text-xs font-medium text-slate-700">
            {disabledMessage || 'Complete verification to unlock signature'}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Use finger or mouse to sign</span>
        <button
          type="button"
          onClick={handleClear}
          className={`text-slate-700 hover:text-slate-900 ${disabled ? 'opacity-50 pointer-events-none' : ''}`.trim()}
        >
          Clear
        </button>
      </div>
    </div>
  )
}
