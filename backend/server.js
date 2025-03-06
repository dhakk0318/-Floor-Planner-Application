const express = require('express');
const app = express();
const PORT =  5000;
const cors = require('cors')
app.use(cors())

 const floorPlanData = {
    rooms: [
      {
        id: "room1",
        name: "Living Room",
        width: 400,
        height: 300,
        x: 50,
        y: 50,
        doors: [
          {
            id: "door1",
            wall: "bottom",
            position: 0.5,
            width: 80,
          },
        ],
        windows: [
          {
            id: "window1",
            wall: "top",
            position: 0.3,
            width: 100,
          },
          {
            id: "window2",
            wall: "top",
            position: 0.7,
            width: 100,
          },
        ],
      },
      {
        id: "room2",
        name: "Kitchen",
        width: 300,
        height: 250,
        x: 500,
        y: 100,
        doors: [
          {
            id: "door2",
            wall: "left",
            position: 0.5,
            width: 80,
          },
        ],
        windows: [
          {
            id: "window3",
            wall: "right",
            position: 0.5,
            width: 120,
          },
        ],
      },
      {
        id: "room3",
        name: "Bedroom",
        width: 350,
        height: 300,
        x: 100,
        y: 400,
        doors: [
          {
            id: "door3",
            wall: "top",
            position: 0.8,
            width: 80,
          },
        ],
        windows: [
          {
            id: "window4",
            wall: "bottom",
            position: 0.5,
            width: 150,
          },
        ],
      },
      {
        id: "room4",
        name: "Bathroom",
        width: 200,
        height: 200,
        x: 500,
        y: 400,
        doors: [
          {
            id: "door4",
            wall: "left",
            position: 0.3,
            width: 70,
          },
        ],
        windows: [
          {
            id: "window5",
            wall: "right",
            position: 0.5,
            width: 80,
          },
        ],
      },
    ],
  }
 app.get('/api/floorplan', (req, res) => {
    res.json(floorPlanData);
});

 app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
