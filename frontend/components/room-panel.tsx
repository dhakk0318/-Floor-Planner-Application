
import { useState } from "react"
import type { Room } from "../types/floor-plan"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"

interface RoomPanelProps {
  rooms: Room[]
  selectedRoom: Room | null
  onRoomSelect: (room: Room | null) => void
  onRoomUpdate: (room: Room) => void
}

export default function RoomPanel({ rooms, selectedRoom, onRoomSelect, onRoomUpdate }: RoomPanelProps) {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [roomName, setRoomName] = useState("")
  const [roomWidth, setRoomWidth] = useState(0)
  const [roomHeight, setRoomHeight] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomName(room.name)
    setRoomWidth(room.width)
    setRoomHeight(room.height)
    setDialogOpen(true)
  }

  const handleSaveRoom = () => {
    if (!editingRoom) return

    const updatedRoom: Room = {
      ...editingRoom,
      name: roomName,
      width: roomWidth,
      height: roomHeight,
    }

    onRoomUpdate(updatedRoom)
    setDialogOpen(false)

    if (selectedRoom && selectedRoom.id === updatedRoom.id) {
      onRoomSelect(updatedRoom)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Rooms</h3>

      <div className="space-y-3">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className={`cursor-pointer ${selectedRoom?.id === room.id ? "border-primary" : ""}`}
            onClick={() => onRoomSelect(room)}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-md">{room.name}</CardTitle>
              <CardDescription>
                {room.width}px × {room.height}px
              </CardDescription>
            </CardHeader>
            <CardFooter className="py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditRoom(room)
                }}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update the room properties below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={roomName} onChange={(e) => setRoomName(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="width" className="text-right">
                Width (px)
              </Label>
              <Input
                id="width"
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="height" className="text-right">
                Height (px)
              </Label>
              <Input
                id="height"
                type="number"
                value={roomHeight}
                onChange={(e) => setRoomHeight(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRoom}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

