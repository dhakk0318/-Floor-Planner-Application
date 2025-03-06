
import type React from "react"

import { useRef, useEffect, useState } from "react"
import type { FloorPlanData, Room, Door, Window } from "../types/floor-plan"

interface FloorPlanProps {
  data: FloorPlanData
  onRoomSelect: (room: Room | null) => void
  onRoomUpdate: (room: Room) => void
}

const GRID_SIZE = 20
const COLORS = {
  room: "#f5f5f5",
  wall: "#333333",
  door: "#8b4513",
  window: "#87ceeb",
  selected: "#e6f7ff",
  grid: "#eeeeee",
  text: "#333333",
}

export default function FloorPlan({ data, onRoomSelect, onRoomUpdate }: FloorPlanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [draggedRoom, setDraggedRoom] = useState<Room | null>(null)
  const [scale, setScale] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })

  // Calculate canvas size based on rooms
  useEffect(() => {
    if (!data || !data.rooms || data.rooms.length === 0) return

    let maxX = 0
    let maxY = 0

    data.rooms.forEach((room) => {
      const roomRight = room.x + room.width
      const roomBottom = room.y + room.height

      if (roomRight > maxX) maxX = roomRight
      if (roomBottom > maxY) maxY = roomBottom
    })

    setCanvasSize({
      width: Math.max(800, maxX + 100),
      height: Math.max(600, maxY + 100),
    })
  }, [data])

  useEffect(() => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawGrid(ctx, canvas.width, canvas.height)

    data.rooms.forEach((room) => {
      drawRoom(ctx, room, room.id === selectedRoomId)
    })
  }, [data, selectedRoomId, scale, canvasSize])

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5

    const scaledGridSize = GRID_SIZE * scale

    for (let x = 0; x < width; x += scaledGridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y < height; y += scaledGridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
  }

  const drawRoom = (ctx: CanvasRenderingContext2D, room: Room, isSelected: boolean) => {
    ctx.fillStyle = isSelected ? COLORS.selected : COLORS.room
    ctx.fillRect(room.x, room.y, room.width, room.height)

    ctx.strokeStyle = COLORS.wall
    ctx.lineWidth = 4
    ctx.strokeRect(room.x, room.y, room.width, room.height)

    ctx.fillStyle = COLORS.text
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(room.name, room.x + room.width / 2, room.y + room.height / 2)

    room.doors.forEach((door) => {
      drawDoor(ctx, room, door)
    })

    room.windows.forEach((window) => {
      drawWindow(ctx, room, window)
    })
  }

  const drawDoor = (ctx: CanvasRenderingContext2D, room: Room, door: Door) => {
    ctx.fillStyle = COLORS.door

    const doorWidth = door.width
    const doorDepth = 10

    let x = 0
    let y = 0
    let width = 0
    let height = 0

    switch (door.wall) {
      case "top":
        x = room.x + room.width * door.position - doorWidth / 2
        y = room.y
        width = doorWidth
        height = doorDepth
        break
      case "right":
        x = room.x + room.width - doorDepth
        y = room.y + room.height * door.position - doorWidth / 2
        width = doorDepth
        height = doorWidth
        break
      case "bottom":
        x = room.x + room.width * door.position - doorWidth / 2
        y = room.y + room.height - doorDepth
        width = doorWidth
        height = doorDepth
        break
      case "left":
        x = room.x
        y = room.y + room.height * door.position - doorWidth / 2
        width = doorDepth
        height = doorWidth
        break
    }

    ctx.fillRect(x, y, width, height)
  }

  const drawWindow = (ctx: CanvasRenderingContext2D, room: Room, window: Window) => {
    ctx.fillStyle = COLORS.window

    const windowWidth = window.width
    const windowDepth = 5

    let x = 0
    let y = 0
    let width = 0
    let height = 0

    switch (window.wall) {
      case "top":
        x = room.x + room.width * window.position - windowWidth / 2
        y = room.y
        width = windowWidth
        height = windowDepth
        break
      case "right":
        x = room.x + room.width - windowDepth
        y = room.y + room.height * window.position - windowWidth / 2
        width = windowDepth
        height = windowWidth
        break
      case "bottom":
        x = room.x + room.width * window.position - windowWidth / 2
        y = room.y + room.height - windowDepth
        width = windowWidth
        height = windowDepth
        break
      case "left":
        x = room.x
        y = room.y + room.height * window.position - windowWidth / 2
        width = windowDepth
        height = windowWidth
        break
    }

    ctx.fillRect(x, y, width, height)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !data) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    let clickedRoom: Room | null = null

    for (let i = data.rooms.length - 1; i >= 0; i--) {
      const room = data.rooms[i]
      if (x >= room.x && x <= room.x + room.width && y >= room.y && y <= room.y + room.height) {
        clickedRoom = room
        break
      }
    }

    setSelectedRoomId(clickedRoom?.id || null)
    onRoomSelect(clickedRoom)
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !data || !selectedRoomId) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const selectedRoom = data.rooms.find((room) => room.id === selectedRoomId)
    if (!selectedRoom) return

    if (
      x >= selectedRoom.x &&
      x <= selectedRoom.x + selectedRoom.width &&
      y >= selectedRoom.y &&
      y <= selectedRoom.y + selectedRoom.height
    ) {
      setIsDragging(true)
      setDragStart({ x, y })
      setDraggedRoom(selectedRoom)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedRoom || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const dx = x - dragStart.x
    const dy = y - dragStart.y

    const newX = Math.round((draggedRoom.x + dx) / GRID_SIZE) * GRID_SIZE
    const newY = Math.round((draggedRoom.y + dy) / GRID_SIZE) * GRID_SIZE

    const updatedRoom = {
      ...draggedRoom,
      x: newX,
      y: newY,
    }

    setDraggedRoom(updatedRoom)
    setDragStart({ x, y })

    onRoomUpdate(updatedRoom)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDraggedRoom(null)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          onClick={handleZoomIn}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        >
          -
        </button>
      </div>
      <div className="overflow-auto border border-gray-200 rounded-lg">
        <canvas
          id="floor-plan"
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-pointer"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
      </div>
    </div>
  )
}

