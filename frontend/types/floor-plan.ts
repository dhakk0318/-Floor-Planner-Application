export interface FloorPlanData {
  rooms: Room[]
}

export interface Room {
  id: string
  name: string
  width: number
  height: number
  x: number
  y: number
  doors: Door[]
  windows: Window[]
}

export interface Door {
  id: string
  wall: "top" | "right" | "bottom" | "left"
  position: number 
  width: number
}

export interface Window {
  id: string
  wall: "top" | "right" | "bottom" | "left"
  position: number  
  width: number
}

