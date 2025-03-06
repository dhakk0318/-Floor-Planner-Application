
import { useState } from "react"
import type { Room, Door, Window } from "../types/floor-plan"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"

interface ElementPanelProps {
  room: Room
  onRoomUpdate: (room: Room) => void
}

export default function ElementPanel({ room, onRoomUpdate }: ElementPanelProps) {
  const [addDoorDialogOpen, setAddDoorDialogOpen] = useState(false)
  const [addWindowDialogOpen, setAddWindowDialogOpen] = useState(false)
  const [doorWall, setDoorWall] = useState<"top" | "right" | "bottom" | "left">("bottom")
  const [doorPosition, setDoorPosition] = useState(0.5)
  const [doorWidth, setDoorWidth] = useState(80)
  const [windowWall, setWindowWall] = useState<"top" | "right" | "bottom" | "left">("top")
  const [windowPosition, setWindowPosition] = useState(0.5)
  const [windowWidth, setWindowWidth] = useState(100)

  const handleAddDoor = () => {
    const newDoor: Door = {
      id: `door-${Date.now()}`,
      wall: doorWall,
      position: doorPosition,
      width: doorWidth,
    }

    const updatedRoom: Room = {
      ...room,
      doors: [...room.doors, newDoor],
    }

    onRoomUpdate(updatedRoom)
    setAddDoorDialogOpen(false)
  }

  const handleAddWindow = () => {
    const newWindow: Window = {
      id: `window-${Date.now()}`,
      wall: windowWall,
      position: windowPosition,
      width: windowWidth,
    }

    const updatedRoom: Room = {
      ...room,
      windows: [...room.windows, newWindow],
    }

    onRoomUpdate(updatedRoom)
    setAddWindowDialogOpen(false)
  }

  const handleRemoveDoor = (doorId: string) => {
    const updatedRoom: Room = {
      ...room,
      doors: room.doors.filter((door) => door.id !== doorId),
    }

    onRoomUpdate(updatedRoom)
  }

  const handleRemoveWindow = (windowId: string) => {
    const updatedRoom: Room = {
      ...room,
      windows: room.windows.filter((window) => window.id !== windowId),
    }

    onRoomUpdate(updatedRoom)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Room Elements: {room.name}</h3>

      <Tabs defaultValue="doors">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doors">Doors</TabsTrigger>
          <TabsTrigger value="windows">Windows</TabsTrigger>
        </TabsList>

        <TabsContent value="doors" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={() => setAddDoorDialogOpen(true)}>Add Door</Button>
          </div>

          {room.doors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No doors added yet</div>
          ) : (
            <div className="space-y-3">
              {room.doors.map((door) => (
                <Card key={door.id}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-md">Door</CardTitle>
                    <CardDescription>
                      Wall: {door.wall}, Position: {Math.round(door.position * 100)}%, Width: {door.width}px
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="py-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveDoor(door.id)}>
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={addDoorDialogOpen} onOpenChange={setAddDoorDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Door</DialogTitle>
                <DialogDescription>Configure the door properties below.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="door-wall" className="text-right">
                    Wall
                  </Label>
                  <Select value={doorWall} onValueChange={(value:any) => setDoorWall(value as any)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select wall" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="door-position" className="text-right">
                    Position (0-1)
                  </Label>
                  <Input
                    id="door-position"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={doorPosition}
                    onChange={(e) => setDoorPosition(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="door-width" className="text-right">
                    Width (px)
                  </Label>
                  <Input
                    id="door-width"
                    type="number"
                    value={doorWidth}
                    onChange={(e) => setDoorWidth(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDoorDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDoor}>Add Door</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="windows" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={() => setAddWindowDialogOpen(true)}>Add Window</Button>
          </div>

          {room.windows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No windows added yet</div>
          ) : (
            <div className="space-y-3">
              {room.windows.map((window) => (
                <Card key={window.id}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-md">Window</CardTitle>
                    <CardDescription>
                      Wall: {window.wall}, Position: {Math.round(window.position * 100)}%, Width: {window.width}px
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="py-2">
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveWindow(window.id)}>
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <Dialog open={addWindowDialogOpen} onOpenChange={setAddWindowDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Window</DialogTitle>
                <DialogDescription>Configure the window properties below.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="window-wall" className="text-right">
                    Wall
                  </Label>
                  <Select value={windowWall} onValueChange={(value: any) => setWindowWall(value as any)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select wall" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="window-position" className="text-right">
                    Position (0-1)
                  </Label>
                  <Input
                    id="window-position"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={windowPosition}
                    onChange={(e) => setWindowPosition(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="window-width" className="text-right">
                    Width (px)
                  </Label>
                  <Input
                    id="window-width"
                    type="number"
                    value={windowWidth}
                    onChange={(e) => setWindowWidth(Number(e.target.value))}
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAddWindowDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddWindow}>Add Window</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}

