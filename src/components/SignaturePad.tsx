"use client"

import React, { useEffect, useRef, useState } from 'react'

interface SignaturePadProps {
  value?: string
  onChange: (value: string) => void
}

export function SignaturePad({ value, onChange }: SignaturePadProps): JSX.Element {
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
    const canvas = canvasRef.current
    if (!canvas) return
    setIsDrawing(false)
    onChange(canvas.toDataURL('image/png'))
  }

  const handleClear = (): void => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white p-3">
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
          className="w-full h-48 sm:h-56 md:h-60 touch-none"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">Use finger or mouse to sign</span>
        <button
          type="button"
          onClick={handleClear}
          className="text-slate-700 hover:text-slate-900"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
