import { useEffect, useState } from "react"
import FloorPlan from "../components/floor-plan"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import type { Room, FloorPlanData } from "../types/floor-plan"
import RoomPanel from "../components/room-panel"
import ElementPanel from "../components/element-panel"
import { Toaster } from "../components/ui/toaster"
import { useToast } from "../components/ui/use-toast"
import { downloadFloorPlanAsImage } from "../lib/utils"

export default function Home() {
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchFloorPlan = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/floorplan")
        if (!response.ok) {
          throw new Error("Failed to fetch floor plan data")
        }
        const data = await response.json()
        setFloorPlanData(data)
      } catch (err) {
        setError("Error loading floor plan. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchFloorPlan()
  }, [])

  const handleRoomSelect = (room: Room | null) => {
    setSelectedRoom(room)
  }

  const handleRoomUpdate = (updatedRoom: Room) => {
    if (!floorPlanData) return

    const updatedRooms = floorPlanData.rooms.map((room) => (room.id === updatedRoom.id ? updatedRoom : room))

    setFloorPlanData({
      ...floorPlanData,
      rooms: updatedRooms,
    })

    toast({
      title: "Room updated",
      description: `${updatedRoom.name} has been updated.`,
    })
  }

  const handleExport = () => {
    if (!floorPlanData) return
    downloadFloorPlanAsImage("floor-plan")
    toast({
      title: "Floor plan exported",
      description: "Your floor plan has been downloaded as an image.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Floor Planner</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/4 bg-white rounded-lg shadow-md p-4">
          {floorPlanData && (
            <FloorPlan data={floorPlanData} onRoomSelect={handleRoomSelect} onRoomUpdate={handleRoomUpdate} />
          )}
          <div className="mt-4 flex justify-end">
            <Button onClick={handleExport}>Export as Image</Button>
          </div>
        </div>

        <div className="lg:w-1/4">
          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="elements">Elements</TabsTrigger>
            </TabsList>
            <TabsContent value="rooms" className="bg-white rounded-lg shadow-md p-4">
              {floorPlanData && (
                <RoomPanel
                  rooms={floorPlanData.rooms}
                  selectedRoom={selectedRoom}
                  onRoomSelect={handleRoomSelect}
                  onRoomUpdate={handleRoomUpdate}
                />
              )}
            </TabsContent>
            <TabsContent value="elements" className="bg-green rounded-lg shadow-md p-4">
              {selectedRoom && <ElementPanel room={selectedRoom} onRoomUpdate={handleRoomUpdate} />}
              {!selectedRoom && (
                <div className="text-center py-8 text-gray-500">Select a room to manage its elements</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </main>
  )
}

