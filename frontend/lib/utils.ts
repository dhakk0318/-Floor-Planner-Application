import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function downloadFloorPlanAsImage(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement
  if (!canvas) return

  const link = document.createElement("a")
  link.download = "floor-plan.png"

  canvas.toBlob((blob) => {
    if (!blob) return

    const url = URL.createObjectURL(blob)
    link.href = url

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  })
}

